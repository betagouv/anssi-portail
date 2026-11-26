import { describe, expect, it } from 'vitest';
import { consigneRéflexesCyberReponseSoumiseDansJournal } from '@bus/consigneReflexesCyberReponseSoumiseDansJournal.js';
import { SimulationRéflexesCyberRéponseSoumise } from '@bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe('L’abonnement qui consigne une réponse à une question de la simulation réflexes cyber dans le journal', () => {
  it('consigne un évènement SimulationRéflexesCyberRéponseSoumise pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneRéflexesCyberReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new SimulationRéflexesCyberRéponseSoumise({
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'SIMULATION_REFLEXES_CYBER_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
        idUtilisateur: 'u1@example.com-hacheHMAC',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });

  it('consigne un évènement SimulationRéflexesCyberRéponseSoumise pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneRéflexesCyberReponseSoumiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new SimulationRéflexesCyberRéponseSoumise({
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'SIMULATION_REFLEXES_CYBER_REPONSE_SOUMISE',
      donnees: {
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
