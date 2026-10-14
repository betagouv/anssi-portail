import { JSDOM } from 'jsdom';
import { EntrepôtContact } from '../../../metier/contacts/entrepotContact.js';
import { RésolveurDePage } from '../resolveurDePage.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurContacts implements ChargeurDeProps {
  constructor(
    private readonly résolveurDePage: RésolveurDePage,
    private readonly entrepôtContact: EntrepôtContact
  ) {}

  async charge(_dom: JSDOM, routeDemandée: string) {
    if (!routeDemandée.match(/\/contacts(\/[^/]*)?\/?$/)) {
      return;
    }

    const contactsInitiaux = {
      regionaux: await this.entrepôtContact.régionaux(),
      sectoriels: await this.entrepôtContact.sectoriels(),
      nationaux: await this.entrepôtContact.nationaux(),
    };
    const codeRegion = this.résolveurDePage.codeRegionContact(routeDemandée);
    return codeRegion ? { contactsInitiaux, regionInitiale: codeRegion } : { contactsInitiaux };
  }
}
