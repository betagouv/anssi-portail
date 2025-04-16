import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { AdaptateurChiffrement } from '../../src/infra/adaptateurChiffrement';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from '../../src/bus/consigneEvenementMAJFavorisUtilisateurDansJournal';
import { MiseAJourFavorisUtilisateur } from '../../src/bus/miseAJourFavorisUtilisateur';

describe("L'abonnement qui consigne la mise à jour des favoris de l'utilisateur dans le journal", () => {
  it('consigne un évènement de MAJFavorisUtilisateur', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-04-16'),
    };

    const adaptateurChiffrement: AdaptateurChiffrement = {
      hacheSha256: (chaineEnClair: string) => `${chaineEnClair}-hache`,
    };

    await consigneEvenementMAJFavorisUtilisateurDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurChiffrement,
    })(
      new MiseAJourFavorisUtilisateur({
        email: 'email@mail.com',
        listeIdFavoris: ['id/favori', 'id/favori2'],
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'MISE_A_JOUR_FAVORIS_UTILISATEUR');
    assert.equal(evenementRecu!.donnees.idUtilisateur, 'email@mail.com-hache');
    assert.equal(evenementRecu!.donnees.listeIdFavoris.length, 2);
    assert.deepEqual(evenementRecu!.date, new Date('2025-04-16'));
  });
});
