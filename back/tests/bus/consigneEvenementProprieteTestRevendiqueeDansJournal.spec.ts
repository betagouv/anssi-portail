import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { ProprieteTestRevendiquee } from '../../src/bus/evenements/proprieteTestRevendiquee';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from '../../src/bus/consigneEvenementProprieteTestRevendiqueeDansJournal';
import { AdaptateurChiffrement } from '../../src/infra/adaptateurChiffrement';

describe("L'abonnement qui consigne la revendication de la propriété d'un test dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurChiffrement: AdaptateurChiffrement;

  const consigneEvenementDansJournal = () =>
    consigneEvenementProprieteTestRevendiqueeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurChiffrement,
    });

  beforeEach(() => {
    adaptateurHorloge = { maintenant: () => new Date() };
    adaptateurChiffrement = {
      hacheSha256: (chaineEnClair: string) => `${chaineEnClair}-hache`,
    };
  });

  it('consigne un évènement de ProprieteTestRevendiquee', async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    adaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementDansJournal()(
      new ProprieteTestRevendiquee({
        emailUtilisateur: 'u1@mail.com',
        idResultatTest: '12345',
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'PROPRIETE_TEST_REVENDIQUEE');
    assert.equal(evenementRecu!.donnees.idResultatTest, '12345');
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });

  it("hache l'email de l'utilisateur", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneEvenementDansJournal()(
      new ProprieteTestRevendiquee({
        emailUtilisateur: 'u1@mail.com',
        idResultatTest: '1',
      })
    );

    assert.equal(evenementRecu!.donnees.idUtilisateur, 'u1@mail.com-hache');
    assert.equal(evenementRecu!.donnees.emailUtilisateur, undefined);
  });
});
