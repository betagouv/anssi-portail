import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneParcoursChangéDansJournal } from '../../src/bus/consigneParcoursChangeDansJournal.js';
import { ParcoursChangé } from '../../src/bus/evenements/parcoursChange.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';

describe("L'abonnement qui consigne l'évènement de changement de parcours dans le journal", () => {
  it("consigne l'évènement ParcoursChangé", async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge: AdaptateurHorloge = {
      maintenant: () => new Date('2025-03-10'),
    };

    await consigneParcoursChangéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
    })(new ParcoursChangé('test@email-hache', 'allégé', 'complet'));

    assert.deepEqual(evenementRecu, {
      type: 'PARCOURS_CHANGÉ',
      donnees: { idUtilisateur: 'test@email-hache', parcoursPrécédent: 'allégé', parcours: 'complet' },
      date: new Date('2025-03-10'),
    });
  });
});
