import { adaptateurJournalPostgres } from './adaptateurJournalPostgres';
import { DonneesEvenement } from './donneesEvenement';

export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: DonneesEvenement) => Promise<void>;
};

export const adaptateurJournalMemoire: AdaptateurJournal = {
  async consigneEvenement(donneesEvenement: DonneesEvenement): Promise<void> {
    console.log(
      `[JOURNAL MSC] Nouvel évènement \n${JSON.stringify(donneesEvenement)}`
    );
  },
};

export const fabriqueAdaptateurJournal = () => {
  return process.env.BASE_DONNEES_JOURNAL_EN_MEMOIRE === 'true'
    ? adaptateurJournalMemoire
    : adaptateurJournalPostgres();
};
