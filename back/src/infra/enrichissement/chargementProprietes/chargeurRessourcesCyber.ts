import { JSDOM } from 'jsdom';
import { EntrepotGuide } from '../../../metier/entrepotGuide.js';
import { AdaptateurEnvironnement } from '../../adaptateurEnvironnement.js';
import { ChargeurDeProps } from './chargeurDeProps.js';
import { guidePresentation } from '../../../presentation/guides/guidePresentation.js';

export class ChargeurRessourcesCyber implements ChargeurDeProps {
  constructor(
    private readonly entrepotGuide: EntrepotGuide,
    private readonly adaptateurEnvironnement: AdaptateurEnvironnement
  ) {}

  async charge(dom: JSDOM) {
    const donnees = dom.window.document.getElementById('donnees-items-cyber')?.textContent;
    if (!donnees) {
      return;
    }

    const { itemsCyber, repartition } = JSON.parse(donnees);
    const guides = await this.entrepotGuide.tous();
    const guidesAvecImages = guides.map(guidePresentation(this.adaptateurEnvironnement));

    return { itemsCyber, guides: guidesAvecImages, repartition };
  }
}
