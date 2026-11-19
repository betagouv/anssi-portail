import type {
  EntrepôtRésultatTestMaturité,
  FiltreResultatsTest,
} from '../../metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { RésultatTestMaturité } from '../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import type { EntréePostgresRésultatTest, EntréePostgresRésultatTestMaturité } from './EntreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestMaturitéPostgres
  extends EntrepôtRésultatTestPostgres<'maturité cyber', RésultatTestMaturité>
  implements EntrepôtRésultatTestMaturité
{
  protected readonly typeTest = 'maturité cyber';

  protected async versRésultat(entrée: EntréePostgresRésultatTestMaturité): Promise<RésultatTestMaturité> {
    const utilisateur = entrée.email_utilisateur_hache
      ? await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache)
      : undefined;

    const résultat = this.construitRésultat(entrée);
    résultat.utilisateur = utilisateur;
    return résultat;
  }

  private construitRésultat(entrée: EntréePostgresRésultatTestMaturité): RésultatTestMaturité {
    if (entrée.reponses === null) {
      throw new Error(`Réponses manquantes pour le résultat de test ${entrée.id}`);
    }

    return new RésultatTestMaturité({
      id: entrée.id,
      dateRealisation: entrée.date_realisation,
      region: entrée.region ?? undefined,
      secteur: entrée.secteur ?? undefined,
      tailleOrganisation: entrée.taille_organisation ?? undefined,
      reponses: entrée.reponses,
      codeSessionGroupe: entrée.code_session_groupe ?? undefined,
    });
  }

  protected versEntrée(résultat: RésultatTestMaturité): EntréePostgresRésultatTestMaturité {
    const { utilisateur } = résultat;
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: utilisateur ? this.adaptateurHachage.hache(utilisateur.email) : null,
      type_test: this.typeTest,
      region: résultat.region ?? null,
      secteur: résultat.secteur ?? null,
      taille_organisation: résultat.tailleOrganisation ?? null,
      reponses: résultat.reponses,
      code_session_groupe: résultat.codeSessionGroupe ?? null,
    };
  }

  async ceuxDeSessionGroupe(code: string): Promise<RésultatTestMaturité[]> {
    const entrées = await this.tableRésultatsTest().where({ code_session_groupe: code });
    return Promise.all(entrées.map((entrée) => this.hydrate(entrée)));
  }

  async tousEnOmettantUtilisateur(): Promise<RésultatTestMaturité[]> {
    const entrées = await this.tableRésultatsTest();
    return entrées.map((entrée) => this.hydrateSansUtilisateur(entrée));
  }

  async parFiltresEnOmettantUtilisateur({
    codeSecteur,
    codeRegion,
    codeTrancheEffectif,
  }: FiltreResultatsTest): Promise<RésultatTestMaturité[]> {
    const requête = this.tableRésultatsTest();
    if (codeSecteur) requête.where({ secteur: codeSecteur });
    if (codeRegion) requête.where({ region: codeRegion });
    if (codeTrancheEffectif) requête.where({ taille_organisation: codeTrancheEffectif });
    const entrées = await requête;
    return entrées.map((entrée) => this.hydrateSansUtilisateur(entrée));
  }

  private hydrateSansUtilisateur(entrée: EntréePostgresRésultatTest): RésultatTestMaturité {
    return this.construitRésultat(this.entréeDuType(entrée));
  }
}
