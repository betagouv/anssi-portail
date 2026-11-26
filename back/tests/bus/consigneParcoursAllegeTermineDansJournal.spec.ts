import { describe, expect, it } from 'vitest';
import { consigneParcoursAllégéTerminéDansJournal } from '@bus/consigneParcoursAllegeTermineDansJournal.js';
import { ParcoursAllégéTerminé } from '@bus/evenements/parcoursAllegeTermine.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'événement de complétion du parcours allégé", () => {
  it("consigne l'événement ParcoursAllégéTerminé", async () => {
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

    await consigneParcoursAllégéTerminéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursAllégéTerminé('test@email'));

    expect(evenementRecu).toEqual({
      type: 'PARCOURS_ALLÉGÉ_TERMINÉ',
      donnees: { idUtilisateur: 'test@email-hacheHMAC' },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
