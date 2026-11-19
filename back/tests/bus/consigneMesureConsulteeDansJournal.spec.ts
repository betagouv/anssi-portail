import { describe, expect, it } from 'vitest';
import { consigneMesureConsulteeDansJournal } from '../../src/bus/consigneMesureConsulteeDansJournal.js';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne la consultation d'une mesure par un utilisateur dans le journal", () => {
  it('consigne un évènement MesureConsultee', async () => {
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

    await consigneMesureConsulteeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new MesureConsultee('u1@example.com', 'AUTH.5'));

    expect(evenementRecu).toEqual({
      type: 'MESURE_CONSULTEE',
      donnees: {
        idUtilisateur: 'u1@example.com-hacheHMAC',
        idMesure: 'AUTH.5',
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
