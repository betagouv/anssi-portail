import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import {
  valideActivites,
  valideEtapeAppartenanceUE,
  valideEtapeDesignation,
  valideLocalisationEtablissementPrincipal,
  valideLocalisationServicesNumeriques,
  valideSecteursActivite,
  valideSousSecteursActivite,
  valideTailleEntitePrivee,
  valideTypeStructure,
} from '../../../src/nis2-simulateur/stores/actions';
import { questionnaireStore } from '../../../src/nis2-simulateur/stores/questionnaire.store';
import type { SecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
import type { Activite } from '../../../../../back/src/metier/nis2-simulateur/Activite.definitions';

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

  describe("à la validation de l'étape « Secteurs d'activité »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
    });

    it("sauvegarde les informations de l'étape", () => {
      questionnaireStore.repond(valideSecteursActivite(['energie']));

      const etat = get(questionnaireStore);
      expect(etat.secteurActivite).toEqual(['energie']);
    });

    it("passe à l'étape « Résultat » s'il n'y a que des secteurs classés « Autre »", () => {
      questionnaireStore.repond(
        valideSecteursActivite(['autreSecteurActivite'])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('resultat');
    });

    it("passe à l'étape « Sous secteurs d'activité » si certains secteurs ont des sous-secteurs", () => {
      const secteurSansSousSecteur = 'sante';
      const secteurAvecSousSecteur = 'energie';
      questionnaireStore.repond(
        valideSecteursActivite([secteurSansSousSecteur, secteurAvecSousSecteur])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('sousSecteursActivite');
    });

    it("passe à l'étape « Activités » dans les autres cas", () => {
      questionnaireStore.repond(
        valideSecteursActivite(['banqueSecteurBancaire'])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('activites');
    });
  });

  describe("à la validation de l'étape « Sous-secteurs d'activité »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
    });

    it("sauvegarde les informations de l'étape", () => {
      questionnaireStore.repond(valideSousSecteursActivite(['electricite']));

      const etat = get(questionnaireStore);
      expect(etat.sousSecteurActivite).toEqual(['electricite']);
    });

    it("passe à l'etape « Résultat » si tous les secteurs & sous-secteurs sont du « Autre » (donc aucun intérêt à aller vers « Activités »)", () => {
      const secteurAvecSousSecteur = 'fabrication';
      questionnaireStore.repond(
        valideSecteursActivite(['autreSecteurActivite', secteurAvecSousSecteur])
      );
      questionnaireStore.repond(
        valideSousSecteursActivite(['autreSousSecteurFabrication'])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('resultat');
    });

    it("passe à l'étape « Activités » s'il y a un secteur qui n'est pas du « Autre » (même si tous les sous-secteurs sont « Autres ») car on va vouloir ses activités", () => {
      const necessiteEtapeActivite = 'eauxUsees';

      questionnaireStore.repond(
        valideSecteursActivite(['transports', necessiteEtapeActivite])
      );
      questionnaireStore.repond(
        valideSousSecteursActivite(['autreSousSecteurTransports'])
      );

      const avecUnSecteurATraiter = get(questionnaireStore);
      expect(avecUnSecteurATraiter.etapeCourante).toBe('activites');
    });

    it("passe à l'étape « Activités » s'il y a des sous-secteurs qui ne sont pas du « Autre »", () => {
      questionnaireStore.repond(valideSousSecteursActivite(['electricite']));

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('activites');
    });
  });

  describe("à la validation de l'étape « Activités »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
    });

    it("sauvegarde les informations de l'étape", () => {
      questionnaireStore.repond(valideActivites(['etablissementCredit']));

      const etat = get(questionnaireStore);
      expect(etat.activites).toEqual(['etablissementCredit']);
    });

    describe("navigue vers l'étape « Localisation de l'établissement principal » ...", () => {
      const secteurs: SecteurActivite[] = [
        'gestionServicesTic',
        'fournisseursNumeriques',
      ];

      it.each(secteurs)(
        "... si le secteur d'activité « %s » est présent",
        (secteur) => {
          questionnaireStore.repond(valideSecteursActivite([secteur]));
          questionnaireStore.repond(
            valideActivites(['autreActiviteHydrogene'])
          );

          const etat = get(questionnaireStore);
          expect(etat.etapeCourante).toBe('localisationEtablissementPrincipal');
        }
      );

      const activites: Activite[] = [
        'registresNomsDomainesPremierNiveau',
        'fournisseurServicesDNS',
        'fournisseurServicesInformatiqueNuage',
        'fournisseurServiceCentresDonnees',
        'fournisseurReseauxDiffusionContenu',
        'fournisseurServicesEnregristrementNomDomaine',
      ];

      it.each(activites)(
        "... si l'activité « %s » est présente",
        (activite) => {
          questionnaireStore.repond(valideActivites([activite]));

          const etat = get(questionnaireStore);
          expect(etat.etapeCourante).toBe('localisationEtablissementPrincipal');
        }
      );
    });

    describe("navigue vers l'étape « Localisation de la fourniture des services numériques »", () => {
      const activites: Activite[] = [
        'fournisseurReseauxCommunicationElectroniquesPublics',
        'fournisseurServiceCommunicationElectroniquesPublics',
      ];

      it.each(activites)(
        "... si l'activité « %s » est présente",
        (activite) => {
          questionnaireStore.repond(valideActivites([activite]));

          const etat = get(questionnaireStore);
          expect(etat.etapeCourante).toBe(
            'localisationFournitureServicesNumeriques'
          );
        }
      );
    });

    it("navigue en priorité vers l'étape « Localisation de l'établissement principal » si les 2 sont possibles", () => {
      questionnaireStore.repond(
        valideActivites([
          'fournisseurReseauxCommunicationElectroniquesPublics',
          'registresNomsDomainesPremierNiveau',
        ])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('localisationEtablissementPrincipal');
    });

    it("navigue vers l'étape « Résultat » sinon", () => {
      questionnaireStore.repond(valideActivites(['acteurDuMarche']));

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('resultat');
    });
  });

  describe("à la validation de l'étape « Localisation de l'établissement principal »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
    });

    it("sauvegarde les informations de l'étape", () => {
      questionnaireStore.repond(
        valideLocalisationEtablissementPrincipal(
          ['horsue'],
          ['autre'],
          ['france']
        )
      );

      const etat = get(questionnaireStore);
      expect(etat.paysDecisionsCyber).toEqual(['horsue']);
      expect(etat.paysOperationsCyber).toEqual(['autre']);
      expect(etat.paysPlusGrandNombreSalaries).toEqual(['france']);
    });

    describe("navigue vers l'étape « Localisation des services numériques »", () => {
      const activites: Activite[] = [
        'fournisseurReseauxCommunicationElectroniquesPublics',
        'fournisseurServiceCommunicationElectroniquesPublics',
      ];

      it.each(activites)(
        "... si l'activité « %s » est présente",
        (activite) => {
          questionnaireStore.repond(
            valideActivites(['fournisseurServicesDNS', activite])
          );

          questionnaireStore.repond(
            valideLocalisationEtablissementPrincipal(['france'], [], [])
          );

          const etat = get(questionnaireStore);
          expect(etat.etapeCourante).toBe(
            'localisationFournitureServicesNumeriques'
          );
        }
      );
    });

    it('sinon navigue vers « Résultat »', () => {
      questionnaireStore.repond(
        valideLocalisationEtablissementPrincipal(['france'], [], [])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('resultat');
    });
  });

  describe("à la validation de l'étape « Localisation des services numériques »", () => {
    beforeEach(() => {
      questionnaireStore.reset();
    });

    it("sauvegarde les informations de l'étape", () => {
      questionnaireStore.repond(
        valideLocalisationServicesNumeriques(['france'])
      );

      const etat = get(questionnaireStore);
      expect(etat.localisationFournitureServicesNumeriques).toEqual(['france']);
    });

    it("navigue vers l'étape « Résultat »", () => {
      questionnaireStore.repond(
        valideLocalisationServicesNumeriques(['france'])
      );

      const etat = get(questionnaireStore);
      expect(etat.etapeCourante).toBe('resultat');
    });
  });
});
