import { describe, expect, it, vi } from 'vitest';
import { consigneRetourArticleDonnéDansJournal } from '../../src/bus/consigneRetourArticleDonneDansJournal.js';
import { RetourArticleDonné } from '../../src/bus/evenements/retourArticleDonne.js';
import { AdaptateurJournal } from '../../src/infra/adaptateurJournal.js';
import { fabriqueAdaptateurHorloge } from '../infra/adaptateurHorlogePourLesTests.js';

describe("L'abonnement qui consigne l'évènement de retour d'un article", () => {
  it("consigne l'évènement", async () => {
    const adaptateurJournal: AdaptateurJournal = {
      consigneEvenement: async () => {},
    };
    const consigneEvenement = vi.spyOn(adaptateurJournal, 'consigneEvenement');
    const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

    await consigneRetourArticleDonnéDansJournal({
      adaptateurHorloge,
      adaptateurJournal,
    })(new RetourArticleDonné({ slug: 'un-article', commentaire: 'un commentaire', retour: 'NEGATIF' }));

    expect(consigneEvenement).toHaveBeenCalledExactlyOnceWith({
      type: 'RETOUR_ARTICLE_DONNE',
      donnees: { slug: 'un-article', retour: 'NEGATIF', commentaire: 'un commentaire' },
      date: Temporal.Instant.from('2025-03-10T00:00:00Z'),
    });
  });
});
