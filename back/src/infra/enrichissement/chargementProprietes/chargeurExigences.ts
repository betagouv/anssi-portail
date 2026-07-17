import { JSDOM } from 'jsdom';
import { EntrepotExigence } from '../../../metier/nis2/entrepotExigence.js';
import { ChargeurDeProps } from './chargeurDeProps.js';

export class ChargeurExigences implements ChargeurDeProps {
  constructor(private entrepôtExigence: EntrepotExigence) {}
  async charge(dom: JSDOM) {
    if (!dom.window.document.getElementById('page-directive-nis2')) return;
    return { exigences: await this.entrepôtExigence.parReferentiel('NIS2') };
  }
}
