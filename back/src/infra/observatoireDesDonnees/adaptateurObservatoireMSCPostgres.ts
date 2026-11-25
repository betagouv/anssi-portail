import { Knex } from 'knex';
import {
  libellésNiveauMaturité,
  tousLesIdNiveauMaturite,
} from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { CumulMensuel, SeuilCompletion, TotalParNiveauMaturite } from '../../metier/observatoire.js';
import { AdaptateurObservatoireMSC } from './adaptateurObservatoireMSC.js';
import { cumulMensuel, total } from './requetesObservatoire.js';

export class AdaptateurObservatoireMSCPostgres implements AdaptateurObservatoireMSC {
  constructor(private readonly knex: Knex) {}

  async totalTestsMaturite(): Promise<number> {
    return total(this.testsMaturite());
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

  async totalTestsSensibilisation(): Promise<number> {
    return total(this.knex('msc.tests_realises'));
  }

  async cumulMensuelTestsSensibilisation(): Promise<CumulMensuel[]> {
    return cumulMensuel(this.knex, this.knex('msc.tests_realises'), 'date_realisation');
  }

  async totalParcoursRejoints(): Promise<number> {
    return total(this.knex('msc.parcours_rejoints'));
  }

  async totalCyberdepartsValides(): Promise<number> {
    return total(this.knex('msc.badges_cyberdepart'));
  }

  async cumulMensuelCyberdepartsValides(): Promise<CumulMensuel[]> {
    return cumulMensuel(this.knex, this.knex('msc.badges_cyberdepart'), 'date');
  }

  async totalCompletions(seuil: SeuilCompletion): Promise<number> {
    return total(this.completions(seuil));
  }

  async cumulMensuelCompletions(seuil: SeuilCompletion): Promise<CumulMensuel[]> {
    return cumulMensuel(this.knex, this.completions(seuil), 'date');
  }

  async dateDerniereExecution(): Promise<Date | null> {
    const resultat = await this.knex('msc.executions').max<{ date: Date | null }>('date_execution as date').first();
    return resultat?.date ?? null;
  }

  private testsMaturite() {
    return this.knex('msc.tests_realises').where({ type_test: 'maturité cyber' });
  }

  private completions(seuil: SeuilCompletion) {
    return this.knex('msc.completions_parcours').where({ seuil });
  }
}
