import { adaptateurJournalPostgres } from './adaptateurJournalPostgres';
import { EvenementDuBus } from '../bus/busEvenements';

export type DonneesEvenement = {
  type: string;
  donnees: EvenementDuBus;
  date: Date;
};

export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: DonneesEvenement) => Promise<void>;
};

const adaptateurJournalMemoire: AdaptateurJournal = {
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
