import {AdaptateurJournal} from "./adaptateurJournal";
import Knex from "knex";
import {v4 as uuidv4} from "uuid";

export const adaptateurJournalPostgres = (): AdaptateurJournal => {
  const config = {
    client: 'pg',
    connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
    pool: { min: 0, max: Number.parseInt(process.env.BASE_DONNEES_JOURNAL_POOL_CONNEXION_MAX || "0") },
  };
  const knex = Knex(config);

  return {
    async consigneEvenement(donneesEvenement: any): Promise<void> {
      const { type, donnees, date } = donneesEvenement;

      return knex('journal_msc.evenements').insert({
        id: uuidv4(),
        type,
        donnees,
        date: new Date(date).toISOString(),
      });
    },
  };
};