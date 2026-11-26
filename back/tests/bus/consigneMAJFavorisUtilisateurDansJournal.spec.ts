import { describe, expect, it } from 'vitest';
import { consigneMAJFavorisUtilisateurDansJournal } from '@bus/consigneMAJFavorisUtilisateurDansJournal.js';
import { MiseAJourFavorisUtilisateur } from '@bus/miseAJourFavorisUtilisateur.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';
import { EntrepotFavoriMemoire } from '../persistance/entrepotFavoriMemoire.js';

describe("L'abonnement qui consigne la mise à jour des favoris de l'utilisateur dans le journal", () => {
  it('consigne un évènement de MAJFavorisUtilisateur', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-04-16T00:00:00Z');

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    const entrepotFavori = new EntrepotFavoriMemoire();
    await entrepotFavori.ajoute({
      utilisateur: jeanneDupont,
      idItemCyber: 'groupe/id',
    });
    await entrepotFavori.ajoute({
      utilisateur: jeanneDupont,
      idItemCyber: 'groupe/id-2',
    });

    await consigneMAJFavorisUtilisateurDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
      entrepotFavori,
    })(
      new MiseAJourFavorisUtilisateur({
        utilisateur: jeanneDupont,
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('MISE_A_JOUR_FAVORIS_UTILISATEUR');
    expect(evenementRecu!.donnees.idUtilisateur).toBe('jeanne.dupont@user.com-hacheHMAC');
    expect(evenementRecu!.donnees.listeIdFavoris).toHaveLength(2);
    expect(evenementRecu!.date).toEqual(Temporal.Instant.from('2025-04-16T00:00:00Z'));
  });
});
