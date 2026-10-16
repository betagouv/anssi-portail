import type { CodeSecteurContact } from '@anssi-portail/contacts-sectoriels';

export type ContactsRegionaux = {
  CSIRT?: {
    nom: string;
    siteWeb: string;
    adresse?: string;
    telephone?: string;
  };
  COT?: {
    nom: string;
    email: string;
  };
  campus?: {
    nom: string;
    siteWeb: string;
    adresse: string;
    email?: string;
  };
  designation: 'territoire' | 'région';
};

export type ContactSectoriel = {
  nom: string;
  siteWeb: string;
};

export type LienContact = {
  libelle: string;
  href: string;
};

export type ContactNational = {
  contacts?: {
    introduction: string;
    liens: LienContact[];
  };
  description: string;
  email?: string;
  téléphone?: string;
  lienPrincipal: LienContact;
  nom: string;
};

export type ContactsInitiaux = {
  regionaux: Record<CodeRegion, ContactsRegionaux>;
  sectoriels: Record<CodeSecteurContact, ContactSectoriel>;
  nationaux: ContactNational[];
};

export const CodeRegions = [
  'FR-ARA',
  'FR-BFC',
  'FR-BRE',
  'FR-CVL',
  'FR-20R',
  'FR-GES',
  'FR-HDF',
  'FR-IDF',
  'FR-976',
  'FR-NAQ',
  'FR-NOR',
  'FR-OCC',
  'FR-PDL',
  'FR-PAC',
  'FR-972',
  'FR-971',
  'FR-973',
  'FR-974',
  'FR-PM',
  'FR-BL',
  'FR-MF',
  'FR-WF',
  'FR-PF',
  'FR-NC',
  'FR-TF',
  'FR-CP',
] as const;

export type CodeRegion = (typeof CodeRegions)[number];

export const estCodeRegion = (codeRegion: string): codeRegion is CodeRegion => {
  return (CodeRegions as readonly string[]).includes(codeRegion);
};
