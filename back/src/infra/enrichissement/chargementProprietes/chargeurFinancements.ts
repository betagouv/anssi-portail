import { JSDOM } from 'jsdom';
import { EntrepotFinancement } from '../../../metier/entrepotFinancement.js';
import { ChargeurDeProps } from './chargeurDeProps.js';
import { RésolveurDePage } from '../résolveurDePage.js';

export class ChargeurFinancements implements ChargeurDeProps {
  constructor(
    private readonly résolveurDePage: RésolveurDePage,
    private readonly entrepôtFinancement: EntrepotFinancement
  ) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    if (routeDemandée.match(/financements$/)) {
      const financementsInitiaux = await this.entrepôtFinancement.tous();
      return { financementsInitiaux };
    }

    const financementInitial = await this.résolveurDePage.financement(routeDemandée);
    if (financementInitial) {
      return { financementInitial };
    }

    return;
  }
}
