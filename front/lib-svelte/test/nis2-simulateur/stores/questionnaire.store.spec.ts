import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';

import {
  valideEtapeAppartenanceUE,
  valideEtapeDesignation,
  valideTailleEntitePrivee,
  valideTypeStructure,
} from '../../../src/nis2-simulateur/stores/actions';
import { questionnaireStore } from '../../../src/nis2-simulateur/stores/questionnaire.store';

describe('le store du questionnaire NIS2', () => {
  it("indique l'étape préalable comme l'étape de départ", () => {
    const store = get(questionnaireStore);
    expect(store.etapeCourante).toBe('prealable');
  });

  it("passe à l'étape désignation quand l'étape préalable est validée", () => {
    questionnaireStore.repond({
      type: 'VALIDE_ETAPE_PREALABLE',
    });
    expect(get(questionnaireStore).etapeCourante).toBe(
      'designationOperateurServicesEssentiels'
    );
  });

  describe("à la validation de l'étape « Désignation »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
      questionnaireStore.repond(valideEtapeDesignation(['oui']));
    });

    it("sauvegarde les informations de l'étape", () => {
      expect(
        get(questionnaireStore).designationOperateurServicesEssentiels
      ).toEqual(['oui']);
    });

    it("passe à l'étape « Appartenance UE »", () => {
      expect(get(questionnaireStore).etapeCourante).toBe(
        'appartenanceUnionEuropeenne'
      );
    });
  });

  describe("à la validation de l'étape « Appartenance UE »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
      questionnaireStore.repond(valideEtapeAppartenanceUE(['france']));
    });

    it("sauvegarde les informations de l'étape", () => {
      expect(get(questionnaireStore).appartenancePaysUnionEuropeenne).toEqual([
        'france',
      ]);
    });

    it("passe à l'étape « Type de structure »", () => {
      expect(get(questionnaireStore).etapeCourante).toBe('typeStructure');
    });
  });

  describe("à la validation de l'étape « Type de structure »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
      questionnaireStore.repond(valideTypeStructure(['privee']));
    });

    it("sauvegarde les informations de l'étape", () => {
      expect(get(questionnaireStore).typeStructure).toEqual(['privee']);
    });

    it("passe à l'étape « Taille d'entité privée », car les structures publiques ne sont pas encore prises en charge", () => {
      expect(get(questionnaireStore).etapeCourante).toBe('tailleEntitePrivee');
    });
  });

  describe("à la validation de l'étape « Taille d'entité privée »", () => {
    beforeEach(() => {
      questionnaireStore.reset();

      questionnaireStore.repond(
        valideTailleEntitePrivee(['petit'], ['moyen'], ['grand'])
      );
    });

    it("sauvegarde les informations de l'étape", () => {
      const etat = get(questionnaireStore);
      expect(etat.trancheNombreEmployes).toEqual(['petit']);
      expect(etat.trancheChiffreAffaire).toEqual(['moyen']);
      expect(etat.trancheBilanFinancier).toEqual(['grand']);
    });

    it("passe à l'étape « Secteurs d'activité »", () => {
      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('secteursActivite');
    });
  });
});
