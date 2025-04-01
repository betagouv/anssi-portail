import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from '../../src/bus/proprieteTestRevendiquee';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from '../../src/bus/consigneEvenementProprieteTestRevendiqueeDansJournal';

describe("L'abonnement qui consigne la revendication de la propriété d'un test dans le journal", () => {
  it('consigne un évènement de ProprieteTestRevendiquee', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementProprieteTestRevendiqueeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(
      new ProprieteTestRevendiquee({
        emailUtilisateur: 'u1@mail.com',
        idResultatTest: '12345',
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'PROPRIETE_TEST_REVENDIQUEE');
    assert.equal(evenementRecu!.donnees.emailUtilisateur, 'u1@mail.com');
    assert.equal(evenementRecu!.donnees.idResultatTest, '12345');
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });
});
