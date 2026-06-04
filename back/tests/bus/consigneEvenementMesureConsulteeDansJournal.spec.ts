import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementMesureConsulteeDansJournal } from '../../src/bus/consigneEvenementMesureConsulteeDansJournal';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';

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

    await consigneEvenementMesureConsulteeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new MesureConsultee('AUTH.5', 'u1@example.com-hache'));

    assert.deepEqual(evenementRecu, {
      type: 'MESURE_CONSULTEE',
      donnees: {
        idMesure: 'AUTH.5',
        idUtilisateur: 'u1@example.com-hache',
      },
      date: new Date('2025-03-10'),
    });
  });
});
