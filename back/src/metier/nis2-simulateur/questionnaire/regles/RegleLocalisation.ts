import { estValeurVide, type Regle } from '../Specifications';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV';
import type { AppartenancePaysUnionEuropeenne } from '../../ChampsSimulateur.definitions';
import { contientUnParmi } from '../../commun.predicats';

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
