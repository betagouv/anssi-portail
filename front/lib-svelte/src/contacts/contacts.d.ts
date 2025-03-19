export type Contacts = {
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
};
