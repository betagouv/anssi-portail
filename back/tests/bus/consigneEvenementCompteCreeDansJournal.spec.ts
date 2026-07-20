import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { consigneEvenementCompteCreeDansJournal } from '../../src/bus/consigneEvenementCompteCreeDansJournal.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

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

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneEvenementCompteCreeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(
      new CompteCree({
        email: 'u1@mail.com',
        nom: 'dupont',
        prenom: 'jean',
        infoLettre: false,
        pixelDeSuiviAccepté: true,
      })
    );

    assert.deepEqual(evenementRecu, {
      type: 'NOUVEL_UTILISATEUR_INSCRIT',
      donnees: { idUtilisateur: 'u1@mail.com-hacheHMAC' },
      date: new Date('2025-03-10'),
    });
  });
});
