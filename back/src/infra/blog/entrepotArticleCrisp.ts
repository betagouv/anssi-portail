import { CmsCrisp, ResumeArticleCrispAvecSlug } from '@lab-anssi/lib';
import { Article } from '../../metier/blog/article.js';
import { EntrepôtArticle } from '../../metier/blog/entrepotArticle.js';
import { RésuméArticle } from '../../metier/blog/resumeArticle.js';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { aseptiseHtml } from '../aseptisationDuHtml.js';
import { Cache } from '../cache.js';

export class EntrepôtArticleCrisp implements EntrepôtArticle {
  private static CLÉ_LISTE_RÉSUMÉS_ARTICLE = 'CLE_LISTE_RÉSUMÉS_ARTICLE';
  private cacheDesRésumés: Cache<RésuméArticle[]>;
  private cacheDesArticles: Cache<Article>;
  constructor(
    private readonly cmsCrisp: CmsCrisp,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {
    this.cacheDesRésumés = new Cache({ ttl: this.adaptateurEnvironnement.crisp().duréeDuCache() });
    this.cacheDesArticles = new Cache({ ttl: this.adaptateurEnvironnement.crisp().duréeDuCache() });
  }
  async tous(): Promise<RésuméArticle[]> {
    if (!this.adaptateurEnvironnement.crisp().catégorieDuBlog()) {
      return [];
    }
    const récupèreDepuisCrisp = async () => {
      const articlesCrisp = await this.cmsCrisp.recupereArticlesCategorie(
        this.adaptateurEnvironnement.crisp().catégorieDuBlog()
      );
      return articlesCrisp
        .filter((ac): ac is ResumeArticleCrispAvecSlug & { slug: string } => !!ac.slug)
        .map((ac): RésuméArticle => ({
          dateDeMiseÀJour: ac.dateMiseAJour ? new Date(ac.dateMiseAJour) : undefined,
          estPublie: ac.estPublie,
          id: ac.id,
          slug: ac.slug,
          titre: ac.titre,
        }));
    };
    return this.cacheDesRésumés.get(EntrepôtArticleCrisp.CLÉ_LISTE_RÉSUMÉS_ARTICLE, récupèreDepuisCrisp);
  }

  async parSlug(slug: string): Promise<Article | undefined> {
    const tousLesRésumésDArticles = await this.tous();
    const résuméTrouvé = tousLesRésumésDArticles.find((r) => r.slug === slug);
    if (!résuméTrouvé) {
      return undefined;
    }
    const récupèreDepuisCrisp = async (): Promise<Article> => {
      const article = await this.cmsCrisp.recupereArticle(résuméTrouvé.id);
      return {
        contenu: aseptiseHtml(article.contenu ?? ''),
        dateDeMiseÀJour: article.dateMiseAJour ? new Date(article.dateMiseAJour) : undefined,
        dateDePublication: article.datePublication ? new Date(article.datePublication) : undefined,
        description: article.description,
        titre: article.titre,
      };
    };

    return this.cacheDesArticles.get(slug, récupèreDepuisCrisp);
  }

  async existe(slug: string): Promise<boolean> {
    return (await this.tous()).some((article) => article.slug === slug);
  }
}
