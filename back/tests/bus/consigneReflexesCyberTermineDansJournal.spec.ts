import { describe, expect, it } from 'vitest';
import { SimulationRéflexesCyberTerminé } from '../../src/bus/evenements/simulationReflexesCyberTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { consigneRéflexesCyberTerminéDansJournal } from '../../src/bus/consigneReflexesCyberReponseTermineDansJournal.js';

describe('L’abonnement qui consigne la fin d’une simulation réflexes cyber dans le journal', () => {
  it('consigne un évènement SimulationRéflexesCyberTermine pour un utilisateur identifié', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };
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
      date: new Date('2025-03-10'),
    });
  });

  it('consigne un évènement SimulationRéflexesCyberTermine pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

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
      date: new Date('2025-03-10'),
    });
  });
});
