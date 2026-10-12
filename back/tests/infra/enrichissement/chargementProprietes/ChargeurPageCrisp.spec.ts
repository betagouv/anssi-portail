import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { ChargeurPageCrisp } from '../../../../src/infra/enrichissement/chargementProprietes/chargeurPageCrisp.js';
import { kitRelais } from '../../../api/objetsPretsALEmploi.js';
import { EntrepôtArticleMémoire } from '../../../persistance/entrepotArticleMemoire.js';

describe('ChargeurPageCrisp', () => {
  const dom = new JSDOM();

  it('charge la page Crisp correspondant à la route demandée', async () => {
    const entrepôtArticle = new EntrepôtArticleMémoire();
    vi.spyOn(entrepôtArticle, 'kitRelais').mockResolvedValue(kitRelais);

    const props = await new ChargeurPageCrisp(entrepôtArticle).charge(dom, '/kit-relais?source=test');

    expect(props?.pageCrisp.contenu).toEqual(kitRelais.contenu);
    expect(props?.pageCrisp.description).toEqual(kitRelais.description);
    expect(props?.pageCrisp.titre).toEqual(kitRelais.titre);
  });

  it('ne charge rien pour une autre route', async () => {
    const entrepôtArticle = new EntrepôtArticleMémoire();

    const props = await new ChargeurPageCrisp(entrepôtArticle).charge(dom, '/catalogue');
    expect(props).toBeUndefined();
  });
});
