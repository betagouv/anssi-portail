import { EntrepôtRésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/entrepotResultatTestVraiFaux.js';
import { RésultatTestVraiFaux } from '../../src/metier/mini-tests/vrai-faux/resultatTestVraiFaux.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestVraiFauxMémoire
  extends EntrepotMemoire<RésultatTestVraiFaux>
  implements EntrepôtRésultatTestVraiFaux {}
