import { describe, expect, it } from 'vitest';
import { consigneBadgeCyberdépartDébloquéDansJournal } from '@bus/consigneBadgeCyberdepartDebloqueDansJournal.js';
import { BadgeCyberdépartDébloqué } from '@bus/evenements/badgeCyberdepartDebloque.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne le déblocage du badge cyberdépart par un utilisateur dans le journal", () => {
  it('consigne un évènement ModuleTermine', async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneBadgeCyberdépartDébloquéDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    })(new BadgeCyberdépartDébloqué('u1@example.com', 8, 10));

    expect(evenementRecu).toEqual({
      type: 'BADGE_CYBERDEPART_DEBLOQUE',
      donnees: {
        idUtilisateur: 'u1@example.com-hacheHMAC',
        nombreMesuresActuel: 8,
        nombreMesuresTotal: 10,
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
