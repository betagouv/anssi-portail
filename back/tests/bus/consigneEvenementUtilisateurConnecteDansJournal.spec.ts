import assert from 'node:assert';
import { describe, it } from 'node:test';
import { UtilisateurConnecte } from '../../src/bus/evenements/utilisateurConnecte';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';
import { consigneEvenementUtilisateurConnecteDansJournal } from '../../src/bus/consigneEvenementUtilisateurConnecteDansJournal';

describe("L'abonnement qui consigne la connexion d'un utilisateur dans le journal", () => {
  it('consigne un évènement UtilisateurConnecte', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneEvenementUtilisateurConnecteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new UtilisateurConnecte('u1@example.com-hache'));

    assert.deepEqual(evenementRecu, {
      type: 'UTILISATEUR_CONNECTE',
      donnees: { idUtilisateur: 'u1@example.com-hache' },
      date: new Date('2025-03-10'),
    });
  });
});
