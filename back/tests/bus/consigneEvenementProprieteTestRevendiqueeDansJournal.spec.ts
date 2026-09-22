import { beforeEach, describe, expect, it } from 'vitest';
import { consigneEvenementProprieteTestRevendiqueeDansJournal } from '../../src/bus/consigneEvenementProprieteTestRevendiqueeDansJournal.js';
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
    return consigneEvenementProprieteTestRevendiqueeDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
      adaptateurHachage,
    });
  };

  beforeEach(() => {
    adaptateurHorloge = { maintenant: () => new Date() };
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
      maintenant: () => new Date('2025-03-10'),
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
    expect(evenementRecu!.date).toEqual(new Date('2025-03-10'));
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
