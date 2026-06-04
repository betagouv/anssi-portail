import { EntrepotExigence } from './nis2/entrepotExigence';
import { ExigenceNIS2 } from './nis2/exigence';

export type Risque = {
  libelle: string;
  description: string;
};

export type LienPourAllerPlusLoin = {
  libelle: string;
  url: string;
};

export class Mesure {
  constructor(
    readonly id: string,
    readonly titre: string,
    readonly phraseAccroche: string,
    readonly explications: string,
    readonly actionPrioritaire: string,
    readonly actionFacileAFaire: string,
    readonly ordre: number,
    readonly risques: Risque[],
    readonly liens: LienPourAllerPlusLoin[],
    readonly referencesNIS2: string[]
  ) {}

  async exigences(entrepotExigence: EntrepotExigence): Promise<ExigenceNIS2[]> {
    const toutesLesExigencesNIS2 = await entrepotExigence.parReferentiel('NIS2');

    return this.referencesNIS2
      .map((ref) => {
        const exigenceTrouvee = toutesLesExigencesNIS2.find((e) => e.reference === ref);
        if (!exigenceTrouvee) {
          return null;
        }
        return {
          contenu: exigenceTrouvee.contenu,
          contenuEnAnglais: exigenceTrouvee.contenuEnAnglais,
          reference: exigenceTrouvee.reference,
          thematique: exigenceTrouvee.thematique,
          objectifSecurite: exigenceTrouvee.objectifSecurite,
          entitesCible: exigenceTrouvee.entitesCible,
          correspondances: {},
        };
      })
      .filter((e) => !!e);
  }
}
