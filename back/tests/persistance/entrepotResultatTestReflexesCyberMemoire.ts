import { EntrepôtRésultatTestRéflexesCyber } from '../../src/metier/mini-tests/reflexes-cyber/entrepotResultatTestReflexesCyber.js';
import { RésultatTestRéflexesCyber } from '../../src/metier/mini-tests/reflexes-cyber/resultatTestReflexesCyber.js';
import { EntrepôtRésultatTestMémoire } from './entrepotResultatTestMemoire.js';

export class EntrepôtRésultatTestRéflexesCyberMémoire
  extends EntrepôtRésultatTestMémoire<RésultatTestRéflexesCyber>
  implements EntrepôtRésultatTestRéflexesCyber
{
  protected copie(entite: RésultatTestRéflexesCyber): RésultatTestRéflexesCyber;
  protected copie(entite: RésultatTestRéflexesCyber | undefined): RésultatTestRéflexesCyber | undefined {
    if (!entite) {
      return undefined;
    }
    const copieDuResultat = new RésultatTestRéflexesCyber({ ...entite });
    copieDuResultat.utilisateur = entite.utilisateur;
    return copieDuResultat;
  }
}
