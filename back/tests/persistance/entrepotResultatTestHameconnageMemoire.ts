import { EntrepôtRésultatTestHameçonnage } from '@metier/mini-tests/hameconnage/entrepotResultatTestHameconnage.js';
import { RésultatTestHameçonnage } from '@metier/mini-tests/hameconnage/resultatTestHameconnage.js';
import { EntrepôtRésultatTestMémoire } from './entrepotResultatTestMemoire.js';

export class EntrepôtRésultatTestHameçonnageMémoire
  extends EntrepôtRésultatTestMémoire<RésultatTestHameçonnage>
  implements EntrepôtRésultatTestHameçonnage
{
  protected copie(entite: RésultatTestHameçonnage): RésultatTestHameçonnage;
  protected copie(entite: RésultatTestHameçonnage | undefined): RésultatTestHameçonnage | undefined {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestHameçonnage({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
