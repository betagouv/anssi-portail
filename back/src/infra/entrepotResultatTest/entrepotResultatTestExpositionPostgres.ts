import { EntrepôtRésultatTestExposition } from '@metier/mini-tests/exposition/entrepotResultatTestExposition.js';
import { RésultatTestExposition } from '@metier/mini-tests/exposition/resultatTestExposition.js';

import { EntréePostgresRésultatTestExposition } from './entreePostgresResultatTest.js';
import { EntrepôtRésultatTestPostgres } from './entrepotResultatTestPostgres.js';

export class EntrepôtRésultatTestExpositionPostgres
  extends EntrepôtRésultatTestPostgres<'exposition', RésultatTestExposition>
  implements EntrepôtRésultatTestExposition
{
  protected readonly typeTest = 'exposition';

  protected async versRésultat(entrée: EntréePostgresRésultatTestExposition): Promise<RésultatTestExposition> {
    const utilisateur = await this.entrepotUtilisateur.parEmailHache(entrée.email_utilisateur_hache);

    if (!utilisateur) {
      throw new Error(`Utilisateur introuvable pour le résultat de test ${entrée.id}`);
    }

    return new RésultatTestExposition({
      id: entrée.id,
      dateRealisation: entrée.date_realisation,
      utilisateur,
    });
  }

  protected versEntrée(résultat: RésultatTestExposition): EntréePostgresRésultatTestExposition {
    return {
      id: résultat.id,
      date_realisation: résultat.dateRealisation,
      email_utilisateur_hache: this.adaptateurHachage.hache(résultat.utilisateur.email),
      type_test: this.typeTest,
    };
  }
}
