import { describe, expect, it } from 'vitest';
import { consigneUtilisateurConnecteDansJournal } from '../../src/bus/consigneUtilisateurConnecteDansJournal.js';
import { UtilisateurConnecte } from '../../src/bus/evenements/utilisateurConnecte.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne la connexion d'un utilisateur dans le journal", () => {
  it('consigne un évènement UtilisateurConnecte', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneUtilisateurConnecteDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new UtilisateurConnecte('u1@example.com-hache', true));

    expect(evenementRecu).toEqual({
      type: 'UTILISATEUR_CONNECTE',
      donnees: {
        idUtilisateur: 'u1@example.com-hache',
        connexionAvecMFA: true,
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
