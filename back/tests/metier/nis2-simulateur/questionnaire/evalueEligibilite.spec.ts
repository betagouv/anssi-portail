import assert from 'node:assert';
import { describe, it } from 'node:test';
import { EtatQuestionnaire, EtatQuestionnaireVide } from '../../../../src/metier/nis2-simulateur/EtatQuestionnaire';
import { leCSV } from './aidesAuxTests';
import { evalueEligibilite } from '../../../../src/metier/nis2-simulateur/questionnaire/evalueEligibilite';

describe("L'évaluation complète de l'égibilité", () => {
  it('soumet un questionnaire à la spécification CSV, et retourne le résultat obtenu', () => {
    const reponseEntiteOse: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['oui'],
    };

    const { resultat } = evalueEligibilite(reponseEntiteOse, leCSV('specification-ose-est-regulee-ee.csv'));

    assert.strictEqual(resultat.regulation, 'Regule');
    assert.strictEqual(resultat.typeEntite, 'EntiteEssentielle');
  });

  it('lève une exception si le questionnaire ne correspond à aucune spécification', () => {
    const reponseNonOse: EtatQuestionnaire = {
      ...EtatQuestionnaireVide,
      designationOperateurServicesEssentiels: ['non'],
    };

    assert.throws(() => evalueEligibilite(reponseNonOse, leCSV('specification-ose-est-regulee-ee.csv')), {
      message: /Aucune spécification/,
    });
  });
});
