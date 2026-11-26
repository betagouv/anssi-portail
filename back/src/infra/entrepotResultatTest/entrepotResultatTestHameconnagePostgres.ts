import { EntrepôtRésultatTestHameçonnage } from '@metier/mini-tests/hameconnage/entrepotResultatTestHameconnage.js';
import { RésultatTestHameçonnage } from '@metier/mini-tests/hameconnage/resultatTestHameconnage.js';

import { EntréePostgresRésultatTestHameçonnage } from './entreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestHameçonnagePostgres
  extends EntrepôtRésultatTestPostgres<'hameçonnage', RésultatTestHameçonnage>
  implements EntrepôtRésultatTestHameçonnage
{
  protected readonly typeTest = 'hameçonnage';

  protected async versRésultat(entrée: EntréePostgresRésultatTestHameçonnage): Promise<RésultatTestHameçonnage> {
    const utilisateur = await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache);

    if (!utilisateur) {
      throw new Error(`Utilisateur introuvable pour le résultat de test ${entrée.id}`);
    }

    return new RésultatTestHameçonnage({
      id: entrée.id,
      dateRealisation: entrée.date_realisation,
      score: entrée.score,
      utilisateur,
    });
  }

  protected versEntrée(résultat: RésultatTestHameçonnage): EntréePostgresRésultatTestHameçonnage {
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: this.adaptateurHachage.hache(résultat.utilisateur.email),
      type_test: this.typeTest,
      score: résultat.score,
    };
  }
}
