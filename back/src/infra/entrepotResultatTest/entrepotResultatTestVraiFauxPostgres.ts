import type { EntrepôtRésultatTestVraiFaux } from '@metier/mini-tests/vrai-faux/entrepotResultatTestVraiFaux.js';
import { RésultatTestVraiFaux } from '@metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import type { EntréePostgresRésultatTestVraiFaux } from './entreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestVraiFauxPostgres
  extends EntrepôtRésultatTestPostgres<'vrai-faux', RésultatTestVraiFaux>
  implements EntrepôtRésultatTestVraiFaux
{
  protected readonly typeTest = 'vrai-faux';

  protected async versRésultat(entrée: EntréePostgresRésultatTestVraiFaux): Promise<RésultatTestVraiFaux> {
    const utilisateur = await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache);

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

  protected versEntrée(résultat: RésultatTestVraiFaux): EntréePostgresRésultatTestVraiFaux {
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: this.adaptateurHachage.hache(résultat.utilisateur.email),
      type_test: this.typeTest,
      score: résultat.score,
    };
  }
}
