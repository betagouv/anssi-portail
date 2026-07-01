import { estValeurVide, type Regle } from '../Specifications.js';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle.js';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire.js';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV.js';
import type { AppartenancePaysUnionEuropeenne } from '../../ChampsSimulateur.definitions.js';

export class RegleEtablissementPrincipal implements Regle {
  constructor(private readonly localisation: AppartenancePaysUnionEuropeenne) {}

  evalue(reponses: EtatQuestionnaire): boolean {
    const [paysDecision] = reponses.paysDecisionsCyber;
    const [paysOperation] = reponses.paysOperationsCyber;
    const [paysSalaries] = reponses.paysPlusGrandNombreSalaries;

    return (
      paysDecision === this.localisation || paysOperation === this.localisation || paysSalaries === this.localisation
    );
  }

  static nouvelle(texte: SpecificationTexte): RegleEtablissementPrincipal | undefined {
    const valeur = texte['Extra - Établissement principal'];

    if (estValeurVide(valeur)) return;

    if (valeur === 'France') return new RegleEtablissementPrincipal('france');

    if (valeur === "Autres États membres de l'Union Européenne") return new RegleEtablissementPrincipal('autre');

    throw new ErreurLectureDeRegle(valeur, 'Extra - Établissement principal');
  }
}
