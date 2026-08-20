import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ParcoursAllégéTerminé } from '../../src/bus/evenements/parcoursAllegeTermine.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { consigneParcoursAllégéTerminéDansJournal } from '../../src/bus/consigneParcoursAllegeTermineDansJournal.js';

describe("L'abonnement qui consigne l'événement de complétion du parcours allégé", () => {
  it("consigne l'événement ParcoursAllégéTerminé", async () => {
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

    await consigneParcoursAllégéTerminéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursAllégéTerminé('test@email'));

    assert.deepEqual(evenementRecu, {
      type: 'PARCOURS_ALLÉGÉ_TERMINÉ',
      donnees: { idUtilisateur: 'test@email-hacheHMAC' },
      date: new Date('2025-03-10'),
    });
  });
});
