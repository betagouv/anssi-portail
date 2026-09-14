import { describe, it, beforeEach, expect } from 'vitest';
import { ResultatEligibilite } from '../../../../src/metier/nis2-simulateur/Regulation.definitions.js';
import { Specifications } from '../../../../src/metier/nis2-simulateur/questionnaire/Specifications.js';
import { RegleEntiteOSE } from '../../../../src/metier/nis2-simulateur/questionnaire/regles/RegleEntiteOSE.js';
import { EtatQuestionnaire, EtatQuestionnaireVide } from '../../../../src/metier/nis2-simulateur/EtatQuestionnaire.js';

describe('Les spécifications', () => {
  const resultatDeLaSpec: ResultatEligibilite = {
    regulation: 'Regule',
    typeEntite: 'EntiteEssentielle',
    pointsAttention: { precisions: [], resumes: [] },
  };

  let entiteOseOuiEstReguleEE: Specifications;

  beforeEach(() => {
    entiteOseOuiEstReguleEE = new Specifications([new RegleEntiteOSE(['oui'])], resultatDeLaSpec, 'R1000');
  });

  it('retourne le résultat spécifié si toutes les réponses du questionnaire sont conformes aux règles', () => {
    const entiteOui: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['oui'],
    };

    const resultat = entiteOseOuiEstReguleEE.evalue(entiteOui);

    expect(resultat).toBe(resultatDeLaSpec);
  });

  it("retourne `undefined` dès qu'une réponse du questionnaire n'est pas conforme à une règle", () => {
    const entiteNon: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['non'],
    };

    const resultat = entiteOseOuiEstReguleEE.evalue(entiteNon);

    expect(resultat).toBeUndefined();
  });
});
