import { PageHtmlCrisp } from '@lab-anssi/lib';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';
import { ChargeurPageCrisp } from '../../../../src/infra/enrichissement/chargementProprietes/chargeurPageCrisp.js';
import { MockCmsCrisp } from '../../../mockCmsCrisp.js';

describe('ChargeurPageCrisp', () => {
  const dom = new JSDOM();

  it('charge la page Crisp correspondant à la route demandée', async () => {
    const cmsCrisp = new MockCmsCrisp();
    const pageCrisp: PageHtmlCrisp = {
      titre: 'Kit relais',
      description: 'Description du kit relais',
      contenu: '<p>Contenu du kit relais</p>',
      tableDesMatieres: [{ id: 'section', texte: 'Section', profondeur: 2 }],
    };
    cmsCrisp.ajouteArticle('9d295bcd-88ba-4f8a-99d5-61fdc788032d', pageCrisp);
    const recupereArticle = vi.spyOn(cmsCrisp, 'recupereArticle');

    const props = await new ChargeurPageCrisp(cmsCrisp).charge(dom, '/kit-relais?source=test');

    expect(recupereArticle).toHaveBeenCalledExactlyOnceWith('9d295bcd-88ba-4f8a-99d5-61fdc788032d');
    expect(props).toEqual({ pageCrisp });
  });

  it('ne charge rien pour une autre route', async () => {
    const cmsCrisp = new MockCmsCrisp();
    const recupereArticle = vi.spyOn(cmsCrisp, 'recupereArticle');

    const props = await new ChargeurPageCrisp(cmsCrisp).charge(dom, '/catalogue');

    expect(recupereArticle).not.toHaveBeenCalled();
    expect(props).toBeUndefined();
  });
});
