import { describe, expect, it } from 'vitest';
import { SimulationRéflexesCyberRéponseSoumise } from '../../src/bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { consigneRéflexesCyberReponseSoumiseDansJournal } from '../../src/bus/consigneReflexesCyberReponseSoumiseDansJournal.js';

describe('L’abonnement qui consigne une réponse à une question de la simulation réflexes cyber dans le journal', () => {
  it('consigne un évènement SimulationRéflexesCyberRéponseSoumise pour un utilisateur identifié', async () => {
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
      date: new Date('2025-03-10'),
    });
  });

  it('consigne un évènement SimulationRéflexesCyberRéponseSoumise pour un utilisateur anonyme', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

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
      date: new Date('2025-03-10'),
    });
  });
});
