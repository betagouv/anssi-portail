export type ContactsRégionaux = {
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
  nom: string;
  description: string;
  contacts?: {
    introduction: string;
    liens: LienContact[];
  };
  lienPrincipal: LienContact;
};

export const codesSecteurContact = [
  'aviation',
  'defense',
  'sante',
  'maritime',
  'enseignement-recherche',
  'social',
] as const;

export type CodeSecteurContact = (typeof codesSecteurContact)[number];
