import { AxiosError, AxiosResponse, HttpStatusCode } from '@anssi-portail/axios';
import { CmsCrisp } from '@lab-anssi/lib';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';
import { EntrepôtArticleCrisp } from '../../src/infra/blog/entrepotArticleCrisp.js';
import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';

describe("L'entrepôt d'article Crisp", () => {
  const articlesCrisp = [
    {
      id: 'id1',
      section: {},
      slug: 'slug-1',
      titre: 'titre 1',
      url: 'url-1',
    },
    {
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

  it("sait récupérer les résumés d'article de Crisp", async () => {
    cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue(articlesCrisp);

    const résumés = await entrepôtArticle.tous();

    expect(résumés).toHaveLength(2);
    expect(résumés[0].slug).toBe('slug-1');
    expect(résumés[0].titre).toBe('titre 1');
    expect(résumés[1].slug).toBe('slug-2');
    expect(résumés[1].titre).toBe('titre 2');
  });

  it('initialise le cache après la récupération des résumés lors du premier appel', async () => {
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

  it("retourne une liste de résumés d'article vide si la catégorie n'est pas fournie", async () => {
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
