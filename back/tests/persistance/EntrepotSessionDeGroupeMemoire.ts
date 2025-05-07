import { EntrepotSessionDeGroupe } from '../../src/metier/entrepotSessionDeGroupe';
import { EntrepotMemoire } from './entrepotMemoire';
import { SessionDeGroupe } from '../../src/metier/sessionDeGroupe';

export class EntrepotSessionDeGroupeMemoire
  extends EntrepotMemoire<SessionDeGroupe>
  implements EntrepotSessionDeGroupe {}
