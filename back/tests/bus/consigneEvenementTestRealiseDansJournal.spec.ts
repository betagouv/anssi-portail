import { describe, it, expect } from 'vitest';
import { consigneEvenementTestRealiseDansJournal } from '../../src/bus/consigneEvenementTestRealiseDansJournal.js';
import { TestRealise } from '../../src/bus/evenements/testRealise.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';

describe("L'abonnement qui consigne la réalisation d'un test dans le journal", () => {
  it('consigne un évènement de NouveauTestRealise', () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    consigneEvenementTestRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(
      new TestRealise({
        region: 'FR-20R',
        reponses: { pilotage: 2 },
        secteur: 'A',
        tailleOrganisation: '00',
        idResultatTest: 'ef3dc8c7-beed-4bd7-a475-409515c28a0c',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('TEST_REALISE');
    expect(evenementRecu!.donnees.region).toBe('FR-20R');
    expect(evenementRecu!.donnees.reponses).toEqual({ pilotage: 2 });
    expect(evenementRecu!.donnees.secteur).toBe('A');
    expect(evenementRecu!.donnees.tailleOrganisation).toBe('00');
    expect(evenementRecu!.date).toEqual(new Date('2025-03-10'));
    expect(evenementRecu!.donnees.idResultatTest).toBe('ef3dc8c7-beed-4bd7-a475-409515c28a0c');
  });
});
