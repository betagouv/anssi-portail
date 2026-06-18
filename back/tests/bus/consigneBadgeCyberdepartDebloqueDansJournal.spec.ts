import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneBadgeCyberdépartDébloquéDansJournal } from '../../src/bus/consigneBadgeCyberdepartDebloqueDansJournal';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal';

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

    await consigneBadgeCyberdépartDébloquéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(new BadgeCyberdépartDébloqué('u1@example.com-hache'));

    assert.deepEqual(evenementRecu, {
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      donnees: {
        idUtilisateur: 'u1@example.com-hache',
      },
      date: new Date('2025-03-10'),
    });
  });
});
