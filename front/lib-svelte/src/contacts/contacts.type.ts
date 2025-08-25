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

export const CodeRegions = [
  'FR-ARA',
  'FR-BFC',
  'FR-BRE',
  'FR-CVL',
  'FR-COM',
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
] as const;

export type CodeRegion = (typeof CodeRegions)[number];

export const estCodeRegion = (codeRegion: string): codeRegion is CodeRegion => {
  return (CodeRegions as readonly string[]).includes(codeRegion);
};
