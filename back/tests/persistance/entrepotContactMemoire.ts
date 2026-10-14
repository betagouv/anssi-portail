import { CodeSecteurContact, ContactSectoriel, ContactsRegionaux } from '../../src/metier/contacts/contacts.js';
import { EntrepotContact } from '../../src/metier/contacts/entrepotContact.js';
import { CodeRegion } from '../../src/metier/referentielRegions.js';

export class EntrepotContactMemoire implements EntrepotContact {
  constructor(
    private readonly contactsRegionaux: Partial<Record<CodeRegion, ContactsRegionaux>> = {},
    private readonly contactsSectoriels: Partial<Record<CodeSecteurContact, ContactSectoriel>> = {}
  ) {}

  async regionaux() {
    return this.contactsRegionaux as Record<CodeRegion, ContactsRegionaux>;
  }

  async regional(codeRegion: CodeRegion) {
    return this.contactsRegionaux[codeRegion];
  }

  async sectoriels() {
    return this.contactsSectoriels as Record<CodeSecteurContact, ContactSectoriel>;
  }
}
