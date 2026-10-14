import { CodeRégion } from '../referentielRegions.js';
import { CodeSecteurContact, ContactNational, ContactSectoriel, ContactsRégionaux } from './contacts.js';

export interface EntrepôtContact {
  régionaux: () => Promise<Record<CodeRégion, ContactsRégionaux>>;
  régional: (codeRégion: CodeRégion) => Promise<ContactsRégionaux | undefined>;
  nationaux: () => Promise<ContactNational[]>;
  sectoriels: () => Promise<Record<CodeSecteurContact, ContactSectoriel>>;
}
