import { estValeurVide, Regle } from '../Specifications';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle';
import { EtatQuestionnaire } from '../../EtatQuestionnaire';
import { SpecificationTexte } from '../FormatDesSpecificationsCSV';
import { TypeStructure } from '../../ChampsSimulateur.definitions';
import { contientUnParmi } from '../../commun.predicats';

export class RegleTypeDeStructure implements Regle {
  constructor(private readonly valeursAcceptees: TypeStructure) {}

  evalue(reponses: EtatQuestionnaire): boolean {
    return contientUnParmi(this.valeursAcceptees)(reponses.typeStructure);
  }

  static nouvelle(texte: SpecificationTexte): RegleTypeDeStructure | undefined {
    const valeur = texte['Type de structure'];

    if (estValeurVide(valeur)) return;
    if (valeur === 'Entreprise privée ou publique') return new RegleTypeDeStructure('privee');

    throw new ErreurLectureDeRegle(valeur, 'Type de structure');
  }
}
