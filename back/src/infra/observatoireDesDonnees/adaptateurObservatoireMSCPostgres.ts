import { Knex } from 'knex';
import {
  libellésNiveauMaturité,
  tousLesIdNiveauMaturite,
} from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { TotalParNiveauMaturite } from '../../metier/observatoire.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';

export class AdaptateurObservatoireMSCPostgres implements AdaptateurObservatoireMSC {
  constructor(private readonly knex: Knex) {}

  async totalTestsMaturite(): Promise<number> {
    const resultat = await this.testsMaturite().count<{ total: string }>('* as total').first();
    return Number(resultat?.total ?? 0);
  }

  async testsMaturiteParNiveau(): Promise<TotalParNiveauMaturite[]> {
    const lignes = await this.testsMaturite()
      .select('niveau')
      .count<{ niveau: string; total: string }[]>('* as total')
      .whereNotNull('niveau')
      .groupBy('niveau')
      .orderByRaw('array_position(?::text[], niveau)', [
        tousLesIdNiveauMaturite.map((id) => libellésNiveauMaturité[id]),
      ]);
    return lignes.map(({ niveau, total }) => ({ niveau, total: Number(total) }));
  }

  async dateDerniereExecution(): Promise<Date | null> {
    const resultat = await this.knex('msc.executions').max<{ date: Date | null }>('date_execution as date').first();
    return resultat?.date ?? null;
  }

  private testsMaturite() {
    return this.knex('msc.tests_realises').where({ type_test: 'maturité cyber' });
  }
}
