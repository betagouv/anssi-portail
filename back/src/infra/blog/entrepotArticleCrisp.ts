import { CmsCrisp, PageHtmlCrisp, ResumeArticleCrispAvecSlug } from '@lab-anssi/lib';
import { Article } from '../../metier/blog/article.js';
import { EntrepôtArticle } from '../../metier/blog/entrepotArticle.js';
import { RésuméArticle } from '../../metier/blog/resumeArticle.js';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { aseptiseHtml } from '../aseptisationDuHtml.js';
import { Cache } from '../cache.js';

export class EntrepôtArticleCrisp implements EntrepôtArticle {
  private static CLÉ_LISTE_RÉSUMÉS_ARTICLE = 'CLE_LISTE_RÉSUMÉS_ARTICLE';
  private static CLÉ_KIT_RELAIS = 'kit-relais';
  private static ID_CRISP_KIT_RELAIS = '9d295bcd-88ba-4f8a-99d5-61fdc788032d';

  private cacheDesRésumés: Cache<RésuméArticle[]>;
  private cacheDesArticles: Cache<Article>;

  constructor(
    private readonly cmsCrisp: CmsCrisp,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {
    this.cacheDesRésumés = new Cache({ ttl: this.adaptateurEnvironnement.crisp().duréeDuCacheEnSecondes() });
    this.cacheDesArticles = new Cache({ ttl: this.adaptateurEnvironnement.crisp().duréeDuCacheEnSecondes() });
  }

  async tousLesArticlesDeBlog(): Promise<RésuméArticle[]> {
    if (!this.adaptateurEnvironnement.crisp().catégorieDuBlog()) {
      return [];
    }
    const récupèreDepuisCrisp = async () => {
      try {
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
      } catch {
        console.error('Erreur sur tousLesArticlesDeBlog');
        return [];
      }
    };

    return this.cacheDesRésumés.get(EntrepôtArticleCrisp.CLÉ_LISTE_RÉSUMÉS_ARTICLE, récupèreDepuisCrisp);
  }

  async articleDeBlogParSlug(slug: string): Promise<Article | undefined> {
    const tousLesRésumésDArticles = await this.tousLesArticlesDeBlog();
    const résuméTrouvé = tousLesRésumésDArticles.find((r) => r.slug === slug);
    if (!résuméTrouvé) {
      return undefined;
    }

    const récupèreDepuisCrisp = async (): Promise<Article> => {
      const article = await this.cmsCrisp.recupereArticle(résuméTrouvé.id);
      return this.depuis(article);
    };

    return this.cacheDesArticles.get(slug, récupèreDepuisCrisp);
  }

  async articleDeBlogExiste(slug: string): Promise<boolean> {
    return (await this.tousLesArticlesDeBlog()).some((article) => article.slug === slug);
  }

  async kitRelais(): Promise<Article> {
    const récupèreDepuisCrisp = async (): Promise<Article> => {
      const article = await this.cmsCrisp.recupereArticle(EntrepôtArticleCrisp.ID_CRISP_KIT_RELAIS);
      return this.depuis(article);
    };

    return this.cacheDesArticles.get(EntrepôtArticleCrisp.CLÉ_KIT_RELAIS, récupèreDepuisCrisp);
  }

  private depuis(articleCrisp: PageHtmlCrisp): Article {
    return {
      contenu: aseptiseHtml(articleCrisp.contenu ?? ''),
      dateDeMiseÀJour: articleCrisp.dateMiseAJour ? new Date(articleCrisp.dateMiseAJour) : undefined,
      dateDePublication: articleCrisp.datePublication ? new Date(articleCrisp.datePublication) : undefined,
      description: articleCrisp.description,
      titre: articleCrisp.titre,
      tableDesMatières: articleCrisp.tableDesMatieres,
    };
  }
}
