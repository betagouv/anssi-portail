import { EntrepôtRésultatTestRéflexesCyber } from '@metier/mini-tests/reflexes-cyber/entrepotResultatTestReflexesCyber.js';
import { RésultatTestRéflexesCyber } from '@metier/mini-tests/reflexes-cyber/resultatTestReflexesCyber.js';
import { EntréePostgresRésultatTestRéflexesCyber } from './entreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestRéflexesCyberPostgres
  extends EntrepôtRésultatTestPostgres<'réflexes cyber', RésultatTestRéflexesCyber>
  implements EntrepôtRésultatTestRéflexesCyber
{
  protected readonly typeTest = 'réflexes cyber';

  protected async versRésultat(entrée: EntréePostgresRésultatTestRéflexesCyber): Promise<RésultatTestRéflexesCyber> {
    const utilisateur = await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache);

    if (!utilisateur) {
      throw new Error(`Utilisateur introuvable pour le résultat de test ${entrée.id}`);
    }

    return new RésultatTestRéflexesCyber({
      id: entrée.id,
      dateRealisation: entrée.date_realisation,
      score: entrée.score,
      utilisateur,
    });
  }

  protected versEntrée(résultat: RésultatTestRéflexesCyber): EntréePostgresRésultatTestRéflexesCyber {
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: this.adaptateurHachage.hache(résultat.utilisateur.email),
      type_test: this.typeTest,
      score: résultat.score,
    };
  }
}
