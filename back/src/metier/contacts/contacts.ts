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
  téléphone?: string;
};

export type LienContact = {
  libelle: string;
  href: string;
};

export type ContactNational = {
  nom: string;
  contacts?: {
    introduction: string;
    liens: LienContact[];
  };
  description: string;
  email?: string;
  fonction: string;
  lienPrincipal: LienContact;
  téléphone?: string;
};
