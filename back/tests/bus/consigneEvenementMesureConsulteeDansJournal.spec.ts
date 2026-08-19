import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementMesureConsulteeDansJournal } from '../../src/bus/consigneEvenementMesureConsulteeDansJournal.js';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne la consultation d'une mesure par un utilisateur dans le journal", () => {
  it('consigne un évènement MesureConsultee', async () => {
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

    await consigneEvenementMesureConsulteeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new MesureConsultee('u1@example.com', 'AUTH.5'));

    assert.deepEqual(evenementRecu, {
      type: 'MESURE_CONSULTEE',
      donnees: {
        idUtilisateur: 'u1@example.com-hacheHMAC',
        idMesure: 'AUTH.5',
      },
      date: new Date('2025-03-10'),
    });
  });
});
