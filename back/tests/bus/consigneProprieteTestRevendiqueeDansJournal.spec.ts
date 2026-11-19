import { beforeEach, describe, expect, it } from 'vitest';
import { consigneProprieteTestRevendiqueeDansJournal } from '../../src/bus/consigneProprieteTestRevendiqueeDansJournal.js';
import { ProprieteTestRevendiquee } from '../../src/bus/evenements/proprieteTestRevendiquee.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { jeanneDupont } from '../api/objetsPretsALEmploi.js';

describe("L'abonnement qui consigne la revendication de la propriété d'un test dans le journal", () => {
  let adaptateurHorloge: AdaptateurHorloge;
  let adaptateurJournal: AdaptateurJournal;
  let adaptateurHachage: AdaptateurHachage;

  const consigneEvenementDansJournal = () => {
    return consigneProprieteTestRevendiqueeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    });
  };

  beforeEach(() => {
    adaptateurHorloge = {
      maintenant: () => Temporal.Now.instant(),
      maintenantZoné: () => Temporal.Now.instant().toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };
    adaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };
  });

  it('consigne un évènement de ProprieteTestRevendiquee', async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    adaptateurHorloge = {
      maintenant: () => Temporal.Instant.from('2025-03-10T00:00:00Z'),
      maintenantZoné: () => Temporal.Instant.from('2025-03-10T00:00:00Z').toZonedDateTimeISO(Temporal.Now.timeZoneId()),
    };

    await consigneEvenementDansJournal()(
      new ProprieteTestRevendiquee({
        utilisateur: jeanneDupont,
        idResultatTest: '12345',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('PROPRIETE_TEST_REVENDIQUEE');
    expect(evenementRecu!.donnees.idResultatTest).toBe('12345');
    expect(evenementRecu!.date).toEqual(Temporal.Instant.from('2025-03-10T00:00:00Z'));
  });

  it("hache l'email de l'utilisateur", async () => {
    let evenementRecu;
    adaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };

    await consigneEvenementDansJournal()(
      new ProprieteTestRevendiquee({
        idResultatTest: '1',
        utilisateur: jeanneDupont,
      })
    );

    expect(evenementRecu!.donnees.idUtilisateur).toBe(`${jeanneDupont.email}-hacheHMAC`);
    expect(evenementRecu!.donnees.emailUtilisateur).toBeUndefined();
  });
});
