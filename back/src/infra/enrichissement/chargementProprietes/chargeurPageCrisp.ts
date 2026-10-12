import { CmsCrisp } from '@lab-anssi/lib';
import { JSDOM } from 'jsdom';
import { ID_CRISP_KIT_RELAIS } from '../../../metier/pageCrisp.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurPageCrisp implements ChargeurDeProps {
  constructor(private readonly cmsCrisp: CmsCrisp) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    const chemin = new URL(routeDemandée, 'http://localhost').pathname;
    const slug = chemin.split('/').filter(Boolean).at(-1);
    if (!slug || slug !== 'kit-relais') return;

    const { titre, tableDesMatieres, description, contenu } = await this.cmsCrisp.recupereArticle(ID_CRISP_KIT_RELAIS);
    return {
      pageCrisp: { titre, description, contenu, tableDesMatieres },
    };
  }
}
