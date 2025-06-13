import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { consigneEvenementMAJFavorisUtilisateurDansJournal } from '../../src/bus/consigneEvenementMAJFavorisUtilisateurDansJournal';
import { MiseAJourFavorisUtilisateur } from '../../src/bus/miseAJourFavorisUtilisateur';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage';
import {fauxAdaptateurHachage} from "../api/fauxObjets";

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

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    const entrepotFavori = new EntrepotFavoriMemoire();
    await entrepotFavori.ajoute({
      emailUtilisateur: 'email@mail.com',
      idItemCyber: 'groupe/id',
    });
    await entrepotFavori.ajoute({
      emailUtilisateur: 'email@mail.com',
      idItemCyber: 'groupe/id-2',
    });

    await consigneEvenementMAJFavorisUtilisateurDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
      entrepotFavori,
    })(
      new MiseAJourFavorisUtilisateur({
        email: 'email@mail.com',
      })
    );

    assert.notEqual(evenementRecu, undefined);
    assert.equal(evenementRecu!.type, 'MISE_A_JOUR_FAVORIS_UTILISATEUR');
    assert.equal(
      evenementRecu!.donnees.idUtilisateur,
      'email@mail.com-hacheHMAC'
    );
    assert.equal(evenementRecu!.donnees.listeIdFavoris.length, 2);
    assert.deepEqual(evenementRecu!.date, new Date('2025-04-16'));
  });
});
