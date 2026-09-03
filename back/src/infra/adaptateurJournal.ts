import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { adaptateurJournalPostgres } from './adaptateurJournalPostgres.js';
import { DonneesEvenement } from './donneesEvenement.js';

export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: DonneesEvenement) => Promise<void>;
};

export const adaptateurJournalMemoire: AdaptateurJournal = {
  async consigneEvenement(donneesEvenement: DonneesEvenement): Promise<void> {
    console.log(`[JOURNAL MSC] Nouvel évènement \n${JSON.stringify(donneesEvenement)}`);
  },
};

export const fabriqueAdaptateurJournal = (adaptateurEnvironnement: AdaptateurEnvironnement) => {
  return adaptateurEnvironnement.journal().baseDeDonnéesActive()
    ? adaptateurJournalPostgres()
    : adaptateurJournalMemoire;
};
