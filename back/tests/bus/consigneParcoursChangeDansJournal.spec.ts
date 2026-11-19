import { describe, expect, it } from 'vitest';
import { consigneParcoursChangéDansJournal } from '../../src/bus/consigneParcoursChangeDansJournal.js';
import { ParcoursChangé } from '../../src/bus/evenements/parcoursChange.js';
import { AdaptateurHachage } from '../../src/infra/adaptateurHachage.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fauxAdaptateurHachage } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'évènement de changement de parcours dans le journal", () => {
  it("consigne l'évènement ParcoursChangé", async () => {
    let evenementRecu;
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async (donneesEvenement: unknown) => {
        evenementRecu = donneesEvenement;
      },
    };
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');
    const suivi = {
      campagne: 'campagne_2026_NA',
      source: 'landing-parcours-securisation',
    };

    const adaptateurHachage: AdaptateurHachage = {
      ...fauxAdaptateurHachage,
      hache: (valeur) => `${valeur}-hacheHMAC`,
    };

    await consigneParcoursChangéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
      adaptateurHachage,
    })(new ParcoursChangé('test@email', 'allégé', 'complet', 'prise-en-compte-mesure', suivi));

    expect(evenementRecu).toEqual({
      type: 'PARCOURS_CHANGÉ',
      donnees: {
        idUtilisateur: 'test@email-hacheHMAC',
        parcoursPrécédent: 'allégé',
        parcours: 'complet',
        motif: 'prise-en-compte-mesure',
        suivi,
      },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
