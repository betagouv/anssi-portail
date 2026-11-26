import { describe, expect, it } from 'vitest';

import { consigneParcoursRejointDansJournal } from '@bus/consigneParcoursRejointDansJournal.js';
import { ParcoursRejoint } from '@bus/evenements/parcoursRejoint.js';
import { AdaptateurHachage } from '@infra/adaptateurHachage.js';
import { AdaptateurJournal } from '@infra/adaptateurJournal.js';

import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'évènement de rattachement à un parcours dans le journal", () => {
  it("consigne l'évènement ParcoursRejoint", async () => {
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

    const suivi = {
      campagne: 'campagne_2026_NA',
      source: 'landing-parcours-securisation',
    };

    await consigneParcoursRejointDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursRejoint('test@email', 'complet', 'prise-en-compte-mesure', suivi));

    expect(evenementRecu).toEqual({
      type: 'PARCOURS_REJOINT',
      donnees: { idUtilisateur: 'test@email-hacheHMAC', parcours: 'complet', motif: 'prise-en-compte-mesure', suivi },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
