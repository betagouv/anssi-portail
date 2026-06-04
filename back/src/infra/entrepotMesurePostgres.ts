import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotMesure } from '../metier/entrepotMesure';
import { LienPourAllerPlusLoin, Mesure, type Risque } from '../metier/mesure';

export type MesurePersistee = {
  id: string;
  id_module: number;
  ordre: number;
  titre: string;
  phrase_accroche: string;
  explications: string;
  action_prioritaire: string;
  action_facile_a_faire: string;
  references_nis2: string[];
  risques: Risque[];
  liens: LienPourAllerPlusLoin[];
};
export class EntrepotMesurePostgres implements EntrepotMesure {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async tous(): Promise<Mesure[]> {
    const mesuresLues = await this.knex<MesurePersistee>('mesures');
    return mesuresLues.map((mesure) => this.convertisEnMesure(mesure));
  }

  async parId(id: string): Promise<Mesure | undefined> {
    const mesurePersistee = await this.knex<MesurePersistee>('mesures').where({ id }).first();
    return mesurePersistee ? this.convertisEnMesure(mesurePersistee) : undefined;
  }

  private convertisEnMesure(mesurePersistee: MesurePersistee): Mesure {
    return new Mesure(
      mesurePersistee.id,
      mesurePersistee.titre,
      mesurePersistee.phrase_accroche,
      mesurePersistee.explications,
      mesurePersistee.action_prioritaire,
      mesurePersistee.action_facile_a_faire,
      mesurePersistee.ordre,
      mesurePersistee.risques,
      mesurePersistee.liens,
      mesurePersistee.references_nis2
    );
  }
}
