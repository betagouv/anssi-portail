import { describe, expect, it } from 'vitest';
import { consigneTestRealiseDansJournal } from '@bus/consigneTestRealiseDansJournal.js';
import { TestRealise } from '@bus/evenements/testRealise.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne la réalisation d'un test dans le journal", () => {
  it('consigne un évènement de NouveauTestRealise', () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    consigneTestRealiseDansJournal({
      adaptateurJournal,
      adaptateurHorloge,
    })(
      new TestRealise({
        region: 'FR-20R',
        reponses: {
          'prise-en-compte-risque': 2,
          pilotage: 2,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        },
        secteur: 'A',
        tailleOrganisation: '00',
        idResultatTest: 'ef3dc8c7-beed-4bd7-a475-409515c28a0c',
      })
    );

    expect(evenementRecu).toBeDefined();
    expect(evenementRecu!.type).toBe('TEST_REALISE');
    expect(evenementRecu!.donnees.region).toBe('FR-20R');
    expect(evenementRecu!.donnees.reponses).toEqual({
      'prise-en-compte-risque': 2,
      pilotage: 2,
      budget: 5,
      'ressources-humaines': 3,
      'adoption-solutions': 2,
      posture: 3,
    });
    expect(evenementRecu!.donnees.secteur).toBe('A');
    expect(evenementRecu!.donnees.tailleOrganisation).toBe('00');
    expect(evenementRecu!.date).toEqual(Temporal.Instant.from('2025-03-10T00:00:00Z'));
    expect(evenementRecu!.donnees.idResultatTest).toBe('ef3dc8c7-beed-4bd7-a475-409515c28a0c');
  });
});
