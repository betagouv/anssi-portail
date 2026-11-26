import { EntrepôtRésultatTestExposition } from '@metier/mini-tests/exposition/entrepotResultatTestExposition.js';
import { RésultatTestExposition } from '@metier/mini-tests/exposition/resultatTestExposition.js';

import { EntrepôtRésultatTestMémoire } from './entrepotResultatTestMemoire.js';

export class EntrepôtRésultatTestExpositionMémoire
  extends EntrepôtRésultatTestMémoire<RésultatTestExposition>
  implements EntrepôtRésultatTestExposition
{
  protected copie(entite: RésultatTestExposition): RésultatTestExposition;
  protected copie(entite: RésultatTestExposition | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestExposition({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
