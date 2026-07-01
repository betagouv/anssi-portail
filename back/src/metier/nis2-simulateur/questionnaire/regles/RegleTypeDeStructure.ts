import { estValeurVide, type Regle } from '../Specifications.js';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle.js';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire.js';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV.js';
import type { TypeStructure } from '../../ChampsSimulateur.definitions.js';
import { contientUnParmi } from '../../commun.predicats.js';

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
