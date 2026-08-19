import assert from 'node:assert';
import { describe, it } from 'node:test';
import { consigneParcoursRejointDansJournal } from '../../src/bus/consigneParcoursRejointDansJournal.js';
import { ParcoursRejoint } from '../../src/bus/evenements/parcoursRejoint.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';

describe("L'abonnement qui consigne l'évènement de rattachement à un parcours dans le journal", () => {
  it("consigne l'évènement ParcoursRejoint", async () => {
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

    const suivi = {
      campagne: 'campagne_2026_NA',
      source: 'landing-parcours-securisation',
    };

    await consigneParcoursRejointDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursRejoint('test@email', 'complet', 'prise-en-compte-mesure', suivi));

    assert.deepEqual(evenementRecu, {
      type: 'PARCOURS_REJOINT',
      donnees: { idUtilisateur: 'test@email-hacheHMAC', parcours: 'complet', motif: 'prise-en-compte-mesure', suivi },
      date: new Date('2025-03-10'),
    });
  });
});
