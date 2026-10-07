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
      estPublie: true,
      id: 'id1',
      section: {},
      slug: 'slug-1',
      titre: 'titre 1',
      url: 'url-1',
      dateMiseAJour: '2024-10-01T14:43:00.000Z',
    },
    {
      estPublie: false,
      id: 'id2',
      section: {},
      slug: 'slug-2',
      titre: 'titre 2',
      url: 'url-2',
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
      cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue(articlesCrisp);

      const résumés = await entrepôtArticle.tous();

      expect(résumés).toHaveLength(2);
      expect(résumés[0].dateDeMiseÀJour?.toISOString()).toEqual('2024-10-01T14:43:00.000Z');
      expect(résumés[0].estPublie).toBeTruthy();
      expect(résumés[0].id).toBe('id1');
      expect(résumés[0].slug).toBe('slug-1');
      expect(résumés[0].titre).toBe('titre 1');
      expect(résumés[1].dateDeMiseÀJour).toBeUndefined();
      expect(résumés[1].estPublie).toBeFalsy();
      expect(résumés[1].id).toBe('id2');
      expect(résumés[1].slug).toBe('slug-2');
      expect(résumés[1].titre).toBe('titre 2');
    });

    it('initialise le cache après le premier appel', async () => {
      const recupereArticlesCategorieEspion = vi
        .spyOn(cmsCrisp, 'recupereArticlesCategorie')
        .mockResolvedValue(articlesCrisp);

      const résumésInitial = await entrepôtArticle.tous();
      const résumésMisEnCache = await entrepôtArticle.tous();

      expect(résumésInitial[0].slug).toBe('slug-1');
      expect(résumésInitial[0].titre).toBe('titre 1');
      expect(résumésInitial[1].slug).toBe('slug-2');
      expect(résumésInitial[1].titre).toBe('titre 2');
      expect(résumésInitial).toEqual(résumésMisEnCache);
      expect(recupereArticlesCategorieEspion).toHaveBeenCalledExactlyOnceWith('fauxIdCatégorieBlog');
    });

    it('ignore les articles sans slug', async () => {
      cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue([
        {
          id: 'id1',
          section: {},
          slug: null,
          titre: 'titre 1',
          url: 'url-1',
        },
      ]);

      const résumés = await entrepôtArticle.tous();

      expect(résumés).toHaveLength(0);
    });

    it("retourne une liste vide si la catégorie n'est pas fournie", async () => {
      cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue(articlesCrisp);
      adaptateurEnvironnement.crisp = () => ({
        ...fauxAdaptateurEnvironnement.crisp(),
        catégorieDuBlog: () => '',
      });

      const résumés = await entrepôtArticle.tous();

      expect(résumés).toHaveLength(0);
    });

    describe("En cas d'erreur de limite de débit Crisp", () => {
      it('fournit les données du cache', async () => {
        const response: AxiosResponse = {
          data: 'erreur',
          status: HttpStatusCode.TooManyRequests,
        } as AxiosResponse;

        cmsCrisp.recupereArticlesCategorie = vi
          .fn()
          .mockResolvedValueOnce(articlesCrisp)
          .mockThrowOnce(new AxiosError('Message', '429', undefined, undefined, response));

        await entrepôtArticle.tous();
        const résumésMisEnCache = await entrepôtArticle.tous();
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
      dateMiseAJour: '2026-10-01T14:43:00.000Z',
      datePublication: '2026-10-01T17:43:00.000Z',
    } satisfies PageHtmlCrisp;

    beforeEach(() => {
      cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue(articlesCrisp);
      cmsCrisp.recupereArticle = vi.fn().mockResolvedValue(articleCrisp);
    });

    it("retourne la représentation html de l'article", async () => {
      const article = await entrepôtArticle.parSlug('slug-1');

      expect(article?.contenu).toBe('<div>contenu</div>');
      expect(article?.description).toBe('Description');
      expect(article?.titre).toBe('titre 1');
      expect(article?.dateDeMiseÀJour?.toISOString()).toEqual('2026-10-01T14:43:00.000Z');
      expect(article?.dateDePublication?.toISOString()).toEqual('2026-10-01T17:43:00.000Z');
      expect(cmsCrisp.recupereArticle).toHaveBeenCalledExactlyOnceWith('id1');
    });

    it('ne retourne rien si on demande un slug inconnu', async () => {
      const article = await entrepôtArticle.parSlug('slug-inconnu');

      expect(article).toBeUndefined();
    });

    it("mets l'article en cache", async () => {
      await entrepôtArticle.parSlug('slug-1');
      const article = await entrepôtArticle.parSlug('slug-1');

      expect(article?.contenu).toBe('<div>contenu</div>');
      expect(article?.description).toBe('Description');
      expect(article?.titre).toBe('titre 1');
      expect(article?.dateDeMiseÀJour?.toISOString()).toEqual('2026-10-01T14:43:00.000Z');
      expect(article?.dateDePublication?.toISOString()).toEqual('2026-10-01T17:43:00.000Z');
      expect(cmsCrisp.recupereArticle).toHaveBeenCalledExactlyOnceWith('id1');
    });
  });

  describe("lors du test d'existence d'un article", () => {
    beforeEach(() => {
      cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue(articlesCrisp);
    });

    it("retourne la non-présence d'un article", async () => {
      const articleExistant = await entrepôtArticle.existe('slug-inconnu');

      expect(articleExistant).toBeFalsy();
    });

    it("retourne la présence d'un article", async () => {
      const articleExistant = await entrepôtArticle.existe('slug-1');

      expect(articleExistant).toBeTruthy();
    });
  });
});
