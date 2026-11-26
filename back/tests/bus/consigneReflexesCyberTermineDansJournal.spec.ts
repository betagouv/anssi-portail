import { describe, expect, it } from 'vitest';

import { consigneRéflexesCyberTerminéDansJournal } from '@bus/consigneReflexesCyberReponseTermineDansJournal.js';
import { SimulationRéflexesCyberTerminé } from '@bus/evenements/simulationReflexesCyberTermine.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe('L’abonnement qui consigne la fin d’une simulation réflexes cyber dans le journal', () => {
  it('consigne un évènement SimulationRéflexesCyberTermine pour un utilisateur identifié', async () => {
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

    await consigneRéflexesCyberTerminéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new SimulationRéflexesCyberTerminé({
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        email: 'u1@example.com',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'SIMULATION_REFLEXES_CYBER_TERMINEE',
      donnees: {
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
        idUtilisateur: 'u1@example.com-hacheHMAC',
        codeRegion: 'FR-IDF',
        codeSecteur: 'A',
        codeTrancheEffectif: '00',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });

  it('consigne un évènement SimulationRéflexesCyberTermine pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneRéflexesCyberTerminéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage: fauxAdaptateurHachage,
    })(
      new SimulationRéflexesCyberTerminé({
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
      })
    );

    expect(evenementRecu).toEqual({
      type: 'SIMULATION_REFLEXES_CYBER_TERMINEE',
      donnees: {
        idCorrélation: 'id-correlation',
        idScénario: 'collectivité',
        idRôle: 'direction',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
