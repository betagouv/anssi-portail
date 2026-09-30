import { CmsCrisp } from '@lab-anssi/lib';
import { describe, expect, it, vi } from 'vitest';
import { EntrepôtArticleCrisp } from '../../src/infra/blog/entrepotArticleCrisp.js';
import { EntrepôtArticle } from '../../src/metier/blog/entrepotArticle.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';

describe("L'entrepôt d'article Crisp", () => {
  let entrepôtArticle: EntrepôtArticle;

  it("sait récupérer les résumés d'article de Crisp", async () => {
    const cmsCrisp: CmsCrisp = new MockCmsCrisp();
    cmsCrisp.recupereArticlesCategorie = vi.fn().mockResolvedValue([
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
    ]);
    entrepôtArticle = new EntrepôtArticleCrisp(cmsCrisp, fauxAdaptateurEnvironnement);

    const résumés = await entrepôtArticle.tous();

    expect(résumés).toHaveLength(2);
    expect(résumés[0].slug).toBe('slug-1');
    expect(résumés[0].titre).toBe('titre 1');
    expect(résumés[1].slug).toBe('slug-2');
    expect(résumés[1].titre).toBe('titre 2');
  });

  it('initialise le cache après la récupération des résumés lors du premier appel', async () => {
    const cmsCrisp: CmsCrisp = new MockCmsCrisp();
    const recupereArticlesCategorieEspion = vi.spyOn(cmsCrisp, 'recupereArticlesCategorie').mockResolvedValue([
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
    ]);
    entrepôtArticle = new EntrepôtArticleCrisp(cmsCrisp, fauxAdaptateurEnvironnement);

    const résumésInitial = await entrepôtArticle.tous();
    const résumésMisEnCache = await entrepôtArticle.tous();

    expect(résumésInitial[0].slug).toBe('slug-1');
    expect(résumésInitial[0].titre).toBe('titre 1');
    expect(résumésInitial[1].slug).toBe('slug-2');
    expect(résumésInitial[1].titre).toBe('titre 2');
    expect(résumésInitial).toEqual(résumésMisEnCache);
    expect(recupereArticlesCategorieEspion).toHaveBeenCalledExactlyOnceWith('fauxIdCatégorieBlog');
  });
});
