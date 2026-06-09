import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneEvenementMesurePriseEnCompteDansJournal } from '../../src/bus/consigneEvenementMesurePriseEnCompteDansJournal';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';

describe("L'abonnement qui consigne la prise en compte d'une mesure par un utilisateur dans le journal", () => {
  it('consigne un évènement MesurePriseEnCompte', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementMesurePriseEnCompteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new MesurePriseEnCompte('u1@example.com-hache', 'AUTH.5'));

    assert.deepEqual(evenementRecu, {
      type: 'MESURE_PRISE_EN_COMPTE',
      donnees: {
        idMesure: 'AUTH.5',
        idUtilisateur: 'u1@example.com-hache',
      },
      date: new Date('2025-03-10'),
    });
  });
});
