import { estValeurVide, type Regle } from '../Specifications.js';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle.js';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire.js';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV.js';
import type { AppartenancePaysUnionEuropeenne } from '../../ChampsSimulateur.definitions.js';
import { contientUnParmi } from '../../commun.predicats.js';

export class RegleLocalisation implements Regle {
  constructor(private readonly valeursAcceptees: AppartenancePaysUnionEuropeenne) {}

  evalue(etat: EtatQuestionnaire) {
    return contientUnParmi(this.valeursAcceptees)(etat.appartenancePaysUnionEuropeenne);
  }

  static nouvelle(texte: SpecificationTexte): RegleLocalisation | undefined {
    const valeur = texte['Localisation'];

    if (estValeurVide(valeur)) return;
    if (valeur === 'France') return new RegleLocalisation('france');

    throw new ErreurLectureDeRegle(valeur, 'Localisation');
  }
}
