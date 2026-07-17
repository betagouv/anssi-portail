import { JSDOM } from 'jsdom';
import { AdaptateurEnvironnement } from '../../adaptateurEnvironnement.js';
import { RésolveurDePage } from '../résolveurDePage.js';
import { ChargeurDeProps } from './chargeurDeProps.js';
import { guidePresentation } from '../../../presentation/guides/guidePresentation.js';

export class ChargeurGuide implements ChargeurDeProps {
  constructor(
    private readonly résolveurDePage: RésolveurDePage,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    const guideTrouvé = await this.résolveurDePage.guide(routeDemandée);
    if (!guideTrouvé) {
      return;
    }

    const guideInitial = guidePresentation(this.adaptateurEnvironnement)(guideTrouvé);
    return { guideInitial };
  }
}
