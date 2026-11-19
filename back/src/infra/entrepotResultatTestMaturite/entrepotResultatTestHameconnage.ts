import { EntrepôtRésultatTestHameçonnage } from '../../metier/mini-tests/hameconnage/entrepotResultatTestHameconnage.js';
import { RésultatTestHameçonnage } from '../../metier/mini-tests/hameconnage/resultatTestHameconnage.js';
import { RésultatTestVraiFaux } from '../../metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import type { EntréePostgresRésultatTestHameçonnage } from './EntreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestHameçonnagePostgres
  extends EntrepôtRésultatTestPostgres<'hameçonnage', RésultatTestVraiFaux>
  implements EntrepôtRésultatTestHameçonnage
{
  protected readonly typeTest = 'hameçonnage';

  protected async versRésultat(entrée: EntréePostgresRésultatTestHameçonnage): Promise<RésultatTestVraiFaux> {
    const utilisateur = entrée.email_utilisateur_hache
      ? await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache)
      : undefined;

    if (entrée.score === null) {
      throw new Error(`Score manquant pour le résultat de test ${entrée.id}`);
    }
    if (!utilisateur) {
      throw new Error(`Utilisateur introuvable pour le résultat de test ${entrée.id}`);
    }

    return new RésultatTestVraiFaux({
      id: entrée.id,
      dateRealisation: entrée.date_realisation,
      score: entrée.score,
      utilisateur,
    });
  }

  protected versEntrée(résultat: RésultatTestHameçonnage): EntréePostgresRésultatTestHameçonnage {
    const { utilisateur } = résultat;
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: utilisateur ? this.adaptateurHachage.hache(utilisateur.email) : null,
      type_test: this.typeTest,
      score: résultat.score,
    };
  }
}
