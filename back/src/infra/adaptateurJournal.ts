export type AdaptateurJournal = {
  consigneEvenement: (donneesEvenement: any) => Promise<void>;
};