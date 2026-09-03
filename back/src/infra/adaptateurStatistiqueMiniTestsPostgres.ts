import Knex from 'knex';
import { AdaptateurStatistiqueMiniTests } from '../metier/adaptateurStatistiqueMiniTests.js';
import { Statistiques } from '../metier/statistiques.js';
import { DonneesEvenement } from './donneesEvenement.js';

type ClésMiniTests = Statistiques['miniTests'];
const correspondanceÉvénementsEtStatistique: Partial<Record<DonneesEvenement['type'], keyof ClésMiniTests>> = {
  QUESTIONNAIRE_VRAI_FAUX_TERMINE: 'vraiFaux',
};

export class AdaptateurStatistiqueMiniTestsPostgres implements AdaptateurStatistiqueMiniTests {
  private readonly knex: Knex.Knex;
  constructor() {
    const config = {
      client: 'pg',
      connection: process.env.BASE_DONNEES_JOURNAL_URL_SERVEUR,
      pool: {
        min: 0,
        max: Number.parseInt(process.env.BASE_DONNEES_JOURNAL_POOL_CONNEXION_MAX || '0'),
      },
    };
    this.knex = Knex(config);
  }

  async nombreDeMiniTestsRéalisés(): Promise<ClésMiniTests> {
    const lignes = await this.knex('evenements')
      .withSchema('journal_msc')
      .select('type')
      .count('* as total')
      .whereIn('type', Object.keys(correspondanceÉvénementsEtStatistique))
      .groupBy('type');

    const totauxParType = Object.fromEntries(lignes.map((ligne) => [ligne.type, Number(ligne.total)]));

    return (
      Object.entries(correspondanceÉvénementsEtStatistique) as [DonneesEvenement['type'], keyof ClésMiniTests][]
    ).reduce((statistiques, [type, cle]) => {
      statistiques[cle] = totauxParType[type] ?? 0;
      return statistiques;
    }, {} as ClésMiniTests);
  }
}
