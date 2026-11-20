import { RésultatTestHameçonnage } from '../../src/metier/mini-tests/hameconnage/resultatTestHameconnage.js';
import { EntrepôtRésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/entrepotResultatTestVraiFaux.js';
import { RésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import { EntrepôtRésultatTestMémoire } from './entrepotResultatTestMemoire.js';

export class EntrepôtRésultatTestVraiFauxMémoire
  extends EntrepôtRésultatTestMémoire<RésultatTestVraiFaux>
  implements EntrepôtRésultatTestVraiFaux
{
  protected copie(entite: RésultatTestVraiFaux): RésultatTestHameçonnage;
  protected copie(entite: RésultatTestVraiFaux | undefined) {
    if (!entite) {
      return undefined;
    }
    const copieDuresultat = new RésultatTestVraiFaux({ ...entite });
    copieDuresultat.utilisateur = entite.utilisateur;
    return copieDuresultat;
  }
}
