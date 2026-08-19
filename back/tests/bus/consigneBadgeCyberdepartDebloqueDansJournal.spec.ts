import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneBadgeCyberdépartDébloquéDansJournal } from '../../src/bus/consigneBadgeCyberdepartDebloqueDansJournal.js';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne le déblocage du badge cyberdépart par un utilisateur dans le journal", () => {
  it('consigne un évènement ModuleTermine', async () => {
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

    await consigneBadgeCyberdépartDébloquéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new BadgeCyberdépartDébloqué('u1@example.com', 8, 10));

    assert.deepEqual(evenementRecu, {
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      donnees: {
        idUtilisateur: 'u1@example.com-hacheHMAC',
        nombreMesuresActuel: 8,
        nombreMesuresTotal: 10,
      },
      date: new Date('2025-03-10'),
    });
  });
});
