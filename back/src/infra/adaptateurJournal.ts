import { adaptateurJournalPostgres } from './adaptateurJournalPostgres';

export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: any) => Promise<void>;
};

const adaptateurJournalMemoire: AdaptateurJournal = {
  async consigneEvenement(donneesEvenement: any): Promise<void> {
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
