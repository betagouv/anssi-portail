import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotMesure } from '../metier/entrepotMesure';
import { LienPourAllerPlusLoin, Mesure, type Risque } from '../metier/mesure';
import { EntrepotExigence } from '../metier/nis2/entrepotExigence';

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
  /**
   * Cache en mémoire sans invalidation : les mesures sont un référentiel.
   * Une modification passera par une migration knex, et donc un redémarrage
   */
  private readonly cache: Map<Mesure['id'], Mesure> = new Map();
  private chargementEnCours: Promise<void> | null = null;

  constructor(private readonly entrepotExigence: EntrepotExigence) {
    this.knex = Knex(config);
  }

  async tous(): Promise<Mesure[]> {
    if (this.cache.size > 0) {
      return [...this.cache.values()];
    }
    if (!this.chargementEnCours) {
      this.chargementEnCours = this.chargerCache().finally(() => {
        this.chargementEnCours = null;
      });
    }
    await this.chargementEnCours;
    return [...this.cache.values()];
  }

  async parId(id: string): Promise<Mesure | undefined> {
    if (this.cache.size === 0) {
      await this.tous();
    }
    return this.cache.get(id);
  }

  private async chargerCache(): Promise<void> {
    const mesuresLues = await this.knex<MesurePersistee>('mesures').where({ id_module: 1 });
    const mesures = await Promise.all(mesuresLues.map((m) => this.convertisEnMesure(m)));
    mesures.forEach((m) => this.cache.set(m.id, m));
  }

  private async convertisEnMesure(mesurePersistee: MesurePersistee): Promise<Mesure> {
    const toutesLesExigencesNIS2 = await this.entrepotExigence.parReferentiel('NIS2');

    const exigences = mesurePersistee.references_nis2
      .map((ref) => {
        const exigenceTrouvee = toutesLesExigencesNIS2.find((e) => e.reference === ref);
        if (!exigenceTrouvee) {
          return null;
        }
        return {
          contenu: exigenceTrouvee.contenu,
          contenuEnAnglais: exigenceTrouvee.contenuEnAnglais,
          reference: exigenceTrouvee.reference,
          thematique: exigenceTrouvee.thematique,
          objectifSecurite: exigenceTrouvee.objectifSecurite,
          entitesCible: exigenceTrouvee.entitesCible,
          correspondances: {},
        };
      })
      .filter((e) => !!e);

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
      exigences
    );
  }
}
