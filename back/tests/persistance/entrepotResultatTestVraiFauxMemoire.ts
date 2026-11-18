import {
  EntrepôtRésultatTestVraiFaux,
  RésultatTestVraiFaux,
} from '../../src/metier/mini-tests/vrai-faux/entrepotResultatTestVraiFaux.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtRésultatTestVraiFauxMémoire
  extends EntrepotMemoire<RésultatTestVraiFaux>
  implements EntrepôtRésultatTestVraiFaux {}
