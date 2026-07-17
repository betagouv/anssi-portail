import { CmsCrisp } from '@lab-anssi/lib';
import { JSDOM } from 'jsdom';
import { render } from 'svelte/server';
import { FournisseurChemin } from '../../api/fournisseurChemin.js';
import { EntrepotFinancement } from '../../metier/entrepotFinancement.js';
import { EntrepotGuide } from '../../metier/entrepotGuide.js';
import { EntrepotExigence } from '../../metier/nis2/entrepotExigence.js';
import { AdaptateurEnvironnement } from '../adaptateurEnvironnement.js';
import { AdaptateurDom } from './adaptateurDom/adaptateurDom.js';
import { AdaptateurLienCanonique } from './adaptateurDom/adaptateurLienCanonique.js';
import { AdaptateurLiensSeo } from './adaptateurDom/adaptateurLiensSeo.js';
import { AdaptateurTitre } from './adaptateurDom/adaptateurTitre.js';
import { ChargeurCrisp } from './chargementProprietes/chargeurCrisp.js';
import { ChargeurDeProps } from './chargementProprietes/chargeurDeProps.js';
import { ChargeurExigences } from './chargementProprietes/chargeurExigences.js';
import { ChargeurFinancements } from './chargementProprietes/chargeurFinancements.js';
import { ChargeurGuide } from './chargementProprietes/chargeurGuides.js';
import { ChargeurRessourcesCyber } from './chargementProprietes/chargeurRessourcesCyber.js';
import { composantsAutorisés } from './composantsAutorises.genere.js';
import { RésolveurDePage } from './résolveurDePage.js';
import { ChargeurFilAriane } from './chargementProprietes/chargeurFilAriane.js';

export interface AdaptateurEnrichissement {
  enrichisAvecComposants: (contenuPage: string, routeDemandée: string) => Promise<string>;
}

class AdaptateurEnrichissementSvelte implements AdaptateurEnrichissement {
  constructor(
    private readonly composantsAutorisés: string[],
    private readonly fournisseurDeChemin: FournisseurChemin,
    private readonly chargeursDeProps: ChargeurDeProps[],
    private readonly adaptateursDom: AdaptateurDom[]
  ) {}

  async enrichisAvecComposants(contenuPage: string, routeDemandée: string) {
    try {
      const dom = new JSDOM(contenuPage);
      const props = await this.chargeProps(dom, routeDemandée);

      for (const nomComposant of this.composantsAutorisés) {
        await this.injecteComposant(dom, nomComposant, props);
      }

      for (const adaptateur of this.adaptateursDom) {
        await adaptateur.adapte(dom, routeDemandée);
      }

      return dom.serialize();
    } catch (e) {
      console.error("Erreur lors de l'injection svelte : ", e);
      return contenuPage;
    }
  }

  private async chargeProps(dom: JSDOM, routeDemandée: string) {
    let props: Record<string, unknown> = {};
    for (const chargeur of this.chargeursDeProps) {
      const partiel = await chargeur.charge(dom, routeDemandée);
      if (partiel) props = { ...props, ...partiel };
    }
    return props;
  }

  private async injecteComposant(dom: JSDOM, nomComposant: string, props: Record<string, unknown>) {
    const divDInjection = dom.window.document.getElementById(nomComposant);
    if (!divDInjection) return;
    const cheminDuComposant = this.fournisseurDeChemin.ressourceDeBase(
      `lib-svelte/dist/serveur/assets/${nomComposant}.js`
    );
    const composantSvelte = await import(cheminDuComposant);
    const { head, body } = render(composantSvelte.default, { props });
    const [headDom] = dom.window.document.getElementsByTagName('head');
    if (headDom) {
      headDom.insertAdjacentHTML('beforeend', head.replaceAll('<style ', '<style nonce="%%NONCE%%" '));
    }
    divDInjection.innerHTML = body;
  }
}

export const fabriqueAdaptateurEnrichissement = async (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  fournisseurDeChemin: FournisseurChemin,
  entrepotGuide: EntrepotGuide,
  entrepôtExigence: EntrepotExigence,
  entrepôtFinancement: EntrepotFinancement,
  cmsCrisp: CmsCrisp
): Promise<AdaptateurEnrichissement> => {
  const résolveurDePage = new RésolveurDePage(entrepotGuide, entrepôtFinancement);

  const chargeursDeProps: ChargeurDeProps[] = [
    new ChargeurRessourcesCyber(entrepotGuide, adaptateurEnvironnement),
    new ChargeurGuide(résolveurDePage, adaptateurEnvironnement),
    new ChargeurExigences(entrepôtExigence),
    new ChargeurFinancements(résolveurDePage, entrepôtFinancement),
    new ChargeurCrisp(cmsCrisp),
    new ChargeurFilAriane(),
  ];

  const adaptateursDom: AdaptateurDom[] = [
    new AdaptateurLiensSeo(),
    new AdaptateurLienCanonique(['/financements', '/guides']),
    new AdaptateurTitre(résolveurDePage),
  ];

  return new AdaptateurEnrichissementSvelte(composantsAutorisés, fournisseurDeChemin, chargeursDeProps, adaptateursDom);
};
