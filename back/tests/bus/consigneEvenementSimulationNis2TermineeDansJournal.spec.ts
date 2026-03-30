import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { SimulationNis2Terminee } from '../../src/bus/evenements/simulationNis2Terminee';
import { consigneEvenementSimulationNis2TermineeDansJournal } from '../../src/bus/consigneEvenementSimulationNis2TermineeDansJournal';
import { EtatQuestionnaire } from '../../src/metier/nis2-simulateur/EtatQuestionnaire';

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
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2026-03-24'),
    };

    await consigneEvenementSimulationNis2TermineeDansJournal({
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

    assert.deepEqual(evenementRecu, {
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
      date: new Date('2026-03-24'),
    });
  });
});
