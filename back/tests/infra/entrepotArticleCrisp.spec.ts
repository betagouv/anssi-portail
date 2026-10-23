import { AxiosError, AxiosResponse, HttpStatusCode } from '@anssi-portail/axios';
import { CmsCrisp, PageHtmlCrisp, ResumeArticleCrispAvecSlug } from '@lab-anssi/lib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';
import { EntrepôtArticleCrisp } from '../../src/infra/blog/entrepotArticleCrisp.js';
import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';

describe("L'entrepôt d'article Crisp", () => {
  const articlesCrisp: ResumeArticleCrispAvecSlug[] = [
    {
      chemin: 'id1',
      slug: 'slug-1',
      titre: 'titre 1',
    },
    {
      chemin: 'id2',
      slug: 'slug-2',
      titre: 'titre 2',
    },
  ];

  let entrepôtArticle: EntrepôtArticle;
  let cmsCrisp: CmsCrisp;
  let adaptateurEnvironnement: AdaptateurEnvironnement;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    adaptateurEnvironnement = { ...fauxAdaptateurEnvironnement };
    cmsCrisp = new MockCmsCrisp();
    entrepôtArticle = new EntrepôtArticleCrisp(cmsCrisp, adaptateurEnvironnement);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('lors de la récupération des résumés', () => {
    it("retourne les détails des résumes d'article", async () => {
      cmsCrisp.recupereArticlesParChemin = vi.fn().mockResolvedValue(articlesCrisp);

      const résumés = await entrepôtArticle.tousLesArticlesDeBlog();

      expect(résumés).toHaveLength(2);
      expect(résumés[0].id).toBe('id1');
      expect(résumés[0].slug).toBe('slug-1');
      expect(résumés[0].titre).toBe('titre 1');
      expect(résumés[1].id).toBe('id2');
      expect(résumés[1].slug).toBe('slug-2');
      expect(résumés[1].titre).toBe('titre 2');
    });

    it('initialise le cache après le premier appel', async () => {
      const recupereArticlesCategorieEspion = vi
        .spyOn(cmsCrisp, 'recupereArticlesParChemin')
        .mockResolvedValue(articlesCrisp);

      const résumésInitial = await entrepôtArticle.tousLesArticlesDeBlog();
      const résumésMisEnCache = await entrepôtArticle.tousLesArticlesDeBlog();

      expect(résumésInitial[0].slug).toBe('slug-1');
      expect(résumésInitial[0].titre).toBe('titre 1');
      expect(résumésInitial[1].slug).toBe('slug-2');
      expect(résumésInitial[1].titre).toBe('titre 2');
      expect(résumésInitial).toEqual(résumésMisEnCache);
      expect(recupereArticlesCategorieEspion).toHaveBeenCalledExactlyOnceWith('fauxIdCatégorieBlog');
    });

    it('ignore les articles sans slug', async () => {
      cmsCrisp.recupereArticlesParChemin = vi.fn().mockResolvedValue([
        {
          id: 'id1',
          section: {},
          slug: null,
          titre: 'titre 1',
          url: 'url-1',
        },
      ]);

      const résumés = await entrepôtArticle.tousLesArticlesDeBlog();

      expect(résumés).toHaveLength(0);
    });

    it("retourne une liste vide si la catégorie n'est pas fournie", async () => {
      cmsCrisp.recupereArticlesParChemin = vi.fn().mockResolvedValue(articlesCrisp);
      adaptateurEnvironnement.crisp = () => ({
        ...fauxAdaptateurEnvironnement.crisp(),
        catégorieDuBlog: () => '',
      });

      const résumés = await entrepôtArticle.tousLesArticlesDeBlog();

      expect(résumés).toHaveLength(0);
    });

    describe("En cas d'erreur de limite de débit Crisp", () => {
      it('fournit les données du cache', async () => {
        const response: AxiosResponse = {
          data: 'erreur',
          status: HttpStatusCode.TooManyRequests,
        } as AxiosResponse;

        cmsCrisp.recupereArticlesParChemin = vi
          .fn()
          .mockResolvedValueOnce(articlesCrisp)
          .mockThrowOnce(new AxiosError('Message', '429', undefined, undefined, response));

        await entrepôtArticle.tousLesArticlesDeBlog();
        const résumésMisEnCache = await entrepôtArticle.tousLesArticlesDeBlog();
        vi.advanceTimersByTime(300 * 1000 + 1); // 5 minutes et 1 ms

        expect(résumésMisEnCache).toHaveLength(2);
      });
    });
  });

  describe("lors de la récupération d'un article par son slug", () => {
    const articleCrisp = {
      contenu: '<div>contenu</div>',
      description: 'Description',
      tableDesMatieres: [],
      titre: 'titre 1',
    } satisfies PageHtmlCrisp;

    beforeEach(() => {
      cmsCrisp.recupereArticlesParChemin = vi.fn().mockResolvedValue(articlesCrisp);
      cmsCrisp.recupereArticle = vi.fn().mockResolvedValue(articleCrisp);
    });

    it("retourne la représentation html de l'article", async () => {
      const article = await entrepôtArticle.articleDeBlogParSlug('slug-1');

      expect(article?.contenu).toBe('<div>contenu</div>');
      expect(article?.description).toBe('Description');
      expect(article?.titre).toBe('titre 1');
      expect(cmsCrisp.recupereArticle).toHaveBeenCalledExactlyOnceWith('id1');
    });

    it('ne retourne rien si on demande un slug inconnu', async () => {
      const article = await entrepôtArticle.articleDeBlogParSlug('slug-inconnu');

      expect(article).toBeUndefined();
    });

    it("mets l'article en cache", async () => {
      await entrepôtArticle.articleDeBlogParSlug('slug-1');
      const article = await entrepôtArticle.articleDeBlogParSlug('slug-1');

      expect(article?.contenu).toBe('<div>contenu</div>');
      expect(article?.description).toBe('Description');
      expect(article?.titre).toBe('titre 1');
      expect(cmsCrisp.recupereArticle).toHaveBeenCalledExactlyOnceWith('id1');
    });
  });

  describe("lors du test d'existence d'un article", () => {
    beforeEach(() => {
      cmsCrisp.recupereArticlesParChemin = vi.fn().mockResolvedValue(articlesCrisp);
    });

    it("retourne la non-présence d'un article", async () => {
      const articleExistant = await entrepôtArticle.articleDeBlogExiste('slug-inconnu');

      expect(articleExistant).toBeFalsy();
    });

    it("retourne la présence d'un article", async () => {
      const articleExistant = await entrepôtArticle.articleDeBlogExiste('slug-1');

      expect(articleExistant).toBeTruthy();
    });
  });
});
