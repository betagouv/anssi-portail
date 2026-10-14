import { CodeRegion } from '../referentielRegions.js';
import { CodeSecteurContact, ContactSectoriel, ContactsRegionaux } from './contacts.js';

export interface EntrepotContact {
  regionaux: () => Promise<Record<CodeRegion, ContactsRegionaux>>;
  regional: (codeRegion: CodeRegion) => Promise<ContactsRegionaux | undefined>;
  sectoriels: () => Promise<Record<CodeSecteurContact, ContactSectoriel>>;
}
