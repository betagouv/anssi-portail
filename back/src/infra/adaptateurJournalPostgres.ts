import { AdaptateurJournal } from './adaptateurJournal.js';
import { DonneesEvenement } from './donneesEvenement.js';
import Knex from 'knex';
import { v7 as uuidv7 } from 'uuid';

export const adaptateurJournalPostgres = (): AdaptateurJournal => {
  const config = {
    client: 'pg',
    connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
    pool: {
      min: 0,
      max: Number.parseInt(process.env.BASE_DONNEES_JOURNAL_POOL_CONNEXION_MAX || '0'),
    },
  };
  const knex = Knex(config);

  return {
    async consigneEvenement(donneesEvenement: DonneesEvenement): Promise<void> {
      const { type, donnees, date } = donneesEvenement;

      return knex('journal_msc.evenements').insert({
        id: uuidv7(),
        type,
        donnees,
        date: new Date(date).toISOString(),
      });
    },
  };
};
