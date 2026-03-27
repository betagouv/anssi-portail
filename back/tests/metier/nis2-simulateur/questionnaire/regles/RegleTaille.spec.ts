import assert from 'node:assert';
import { describe, it } from 'node:test';
import { UnionPetitMoyenGrand } from '../../../../../src/metier/nis2-simulateur/ChampsSimulateur.definitions';
import { EtatQuestionnaire, EtatQuestionnaireVide } from '../../../../../src/metier/nis2-simulateur/EtatQuestionnaire';
import { RegleTaille } from '../../../../../src/metier/nis2-simulateur/questionnaire/regles/RegleTaille';

describe('La règle de « Taille »', () => {
  const tailles: Record<string, UnionPetitMoyenGrand> = {
    Petite: 'petit',
    Moyenne: 'moyen',
    Grande: 'grand',
  };
  const nbSalaries: Record<string, UnionPetitMoyenGrand> = {
    '< 50': 'petit',
    '>= 50 et < 250': 'moyen',
    '>= 250': 'grand',
  };
  const tranchesCa: Record<string, UnionPetitMoyenGrand> = {
    '< 10M€': 'petit',
    '>= 10M€ et < 50M€': 'moyen',
    '>= 50M€': 'grand',
  };
  const tranchesBilan: Record<string, UnionPetitMoyenGrand> = {
    '< 10M€': 'petit',
    '>= 10M€ et < 43M€': 'moyen',
    '>= 43M€': 'grand',
  };

  describe("lorsque seuls « nombre de salariés » et « chiffre d'affaires annuel » importent", () => {
    const casDeTest: {
      tailleAttendue: string;
      salaries: string;
      ca: string;
    }[] = [
      { tailleAttendue: 'Petite', salaries: '< 50', ca: '< 10M€' },
      { tailleAttendue: 'Moyenne', salaries: '>= 50 et < 250', ca: '< 10M€' },
      { tailleAttendue: 'Moyenne', salaries: '>= 50 et < 250', ca: '>= 10M€ et < 50M€' },
      { tailleAttendue: 'Grande', salaries: '>= 250', ca: '< 10M€' },
      { tailleAttendue: 'Grande', salaries: '>= 250', ca: '>= 10M€ et < 50M€' },
      { tailleAttendue: 'Grande', salaries: '>= 250', ca: '>= 50M€' },
    ];

    for (const { tailleAttendue, salaries, ca } of casDeTest) {
      it(`Nombre de salariés : ${salaries} . Chiffre d'affaires : ${ca} . Taille : ${tailleAttendue} `, () => {
        const entite: EtatQuestionnaire = {
          ...EtatQuestionnaireVide,
          trancheNombreEmployes: [nbSalaries[salaries]],
          trancheChiffreAffaire: [tranchesCa[ca]],
        };

        const spec = new RegleTaille(tailles[tailleAttendue]);

        const resultat = spec.evalue(entite);

        assert.ok(resultat);
      });
    }
  });

  describe('lorsque tous les critères importent', () => {
    const casDeTest: {
      tailleAttendue: string;
      salaries: string;
      ca: string;
      bilanFinancier: string;
    }[] = [
      { tailleAttendue: 'Petite', salaries: '< 50', ca: '>= 10M€ et < 50M€', bilanFinancier: '< 10M€' },
      { tailleAttendue: 'Moyenne', salaries: '< 50', ca: '>= 10M€ et < 50M€', bilanFinancier: '>= 10M€ et < 43M€' },
      { tailleAttendue: 'Moyenne', salaries: '< 50', ca: '>= 10M€ et < 50M€', bilanFinancier: '>= 43M€' },
      { tailleAttendue: 'Petite', salaries: '< 50', ca: '>= 50M€', bilanFinancier: '< 10M€' },
      { tailleAttendue: 'Moyenne', salaries: '< 50', ca: '>= 50M€', bilanFinancier: '>= 10M€ et < 43M€' },
      { tailleAttendue: 'Grande', salaries: '< 50', ca: '>= 50M€', bilanFinancier: '>= 43M€' },
      { tailleAttendue: 'Moyenne', salaries: '>= 50 et < 250', ca: '>= 50M€', bilanFinancier: '< 10M€' },
      { tailleAttendue: 'Moyenne', salaries: '>= 50 et < 250', ca: '>= 50M€', bilanFinancier: '>= 10M€ et < 43M€' },
      { tailleAttendue: 'Grande', salaries: '>= 50 et < 250', ca: '>= 50M€', bilanFinancier: '>= 43M€' },
    ];

    for (const { tailleAttendue, salaries, ca, bilanFinancier } of casDeTest) {
      it(`Nombre de salariés : ${salaries} . Chiffre d'affaires : ${ca} . Bilan: ${bilanFinancier} . Taille : ${tailleAttendue} `, () => {
        const entite: EtatQuestionnaire = {
          ...EtatQuestionnaireVide,
          trancheNombreEmployes: [nbSalaries[salaries]],
          trancheChiffreAffaire: [tranchesCa[ca]],
          trancheBilanFinancier: [tranchesBilan[bilanFinancier]],
        };

        const spec = new RegleTaille(tailles[tailleAttendue]);

        const resultat = spec.evalue(entite);

        assert.ok(resultat);
      });
    }
  });
});
