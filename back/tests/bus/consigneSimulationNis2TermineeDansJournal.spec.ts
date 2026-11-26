import { describe, expect, it } from 'vitest';
import { EtatQuestionnaire } from '@metier/nis2-simulateur/EtatQuestionnaire.js';
import { consigneSimulationNis2TermineeDansJournal } from '@bus/consigneSimulationNis2TermineeDansJournal.js';
import { SimulationNis2Terminee } from '@bus/evenements/simulationNis2Terminee.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne une simulation NIS2 terminée dans le journal", () => {
  const reponseComplete = (): EtatQuestionnaire => ({
    etapeCourante: 'resultat',
    designationOperateurServicesEssentiels: ['nsp'],
    appartenancePaysUnionEuropeenne: ['france'],
    typeStructure: ['privee'],
    trancheNombreEmployes: ['petit'],
    trancheChiffreAffaire: ['petit'],
    trancheBilanFinancier: [],
    secteurActivite: ['banqueSecteurBancaire'],
    sousSecteurActivite: [],
    activites: ['etablissementCredit'],
    typeEntitePublique: [],
    localisationFournitureServicesNumeriques: [],
    paysDecisionsCyber: [],
    paysOperationsCyber: [],
    paysPlusGrandNombreSalaries: [],
  });

  it('consigne un évènement SimulationNis2Terminee', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2026-03-24T00:00:00Z');

    await consigneSimulationNis2TermineeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(
      new SimulationNis2Terminee({
        reponses: reponseComplete(),
        eligibilite: {
          resultat: {
            regulation: 'Regule',
            typeEntite: 'EntiteImportante',
            pointsAttention: { resumes: [], precisions: [] },
          },
          specificationsRetenues: ['R1370'],
        },
      })
    );

    expect(evenementRecu).toEqual({
      type: 'SIMULATION_NIS2_TERMINEE',
      donnees: {
        reponses: {
          etapeCourante: 'resultat',
          designationOperateurServicesEssentiels: ['nsp'],
          appartenancePaysUnionEuropeenne: ['france'],
          typeStructure: ['privee'],
          trancheNombreEmployes: ['petit'],
          trancheChiffreAffaire: ['petit'],
          trancheBilanFinancier: [],
          secteurActivite: ['banqueSecteurBancaire'],
          sousSecteurActivite: [],
          activites: ['etablissementCredit'],
          typeEntitePublique: [],
          localisationFournitureServicesNumeriques: [],
          paysDecisionsCyber: [],
          paysOperationsCyber: [],
          paysPlusGrandNombreSalaries: [],
        },
        eligibilite: {
          resultat: {
            regulation: 'Regule',
            typeEntite: 'EntiteImportante',
            pointsAttention: { resumes: [], precisions: [] },
          },
          specificationsRetenues: ['R1370'],
        },
      },
      date: Temporal.Instant.from('2026-03-24T00:00:00Z'),
    });
  });
});
