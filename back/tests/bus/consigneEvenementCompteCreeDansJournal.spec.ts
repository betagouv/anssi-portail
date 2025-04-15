import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { CompteCree } from '../../src/bus/compteCree';
import { consigneEvenementCompteCreeDansJournal } from '../../src/bus/consigneEvenementCompteCreeDansJournal';
import { AdaptateurChiffrement } from '../../src/infra/adaptateurChiffrement';

describe("L'abonnement qui consigne la création d'un compte utilisateur dans le journal", () => {
  it('consigne un évènement de NouvelUtilisateurInscrit', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    const adaptateurChiffrement: AdaptateurChiffrement = {
      hacheSha256: (chaineEnClair: string) => `${chaineEnClair}-hache`,
    };

    await consigneEvenementCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurChiffrement,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'NOUVEL_UTILISATEUR_INSCRIT');
    assert.equal(evenementRecu!.donnees.idUtilisateur, 'u1@mail.com-hache');
    assert.deepEqual(evenementRecu!.date, new Date('2025-03-10'));
  });
});
