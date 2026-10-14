import { CodeRegion } from '../referentielRegions.js';
import { CodeSecteurContact, ContactNational, ContactSectoriel, ContactsRegionaux } from './contacts.js';

export interface EntrepotContact {
  regionaux: () => Promise<Record<CodeRegion, ContactsRegionaux>>;
  regional: (codeRegion: CodeRegion) => Promise<ContactsRegionaux | undefined>;
  nationaux: () => Promise<ContactNational[]>;
  sectoriels: () => Promise<Record<CodeSecteurContact, ContactSectoriel>>;
}
