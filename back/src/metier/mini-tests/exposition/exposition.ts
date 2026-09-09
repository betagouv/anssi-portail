export const typesOrganisation = ['collectivite', 'association', 'grand-groupe', 'tpe-pme-eti'] as const;

export type TypeOrganisation = (typeof typesOrganisation)[number];

export const secteurs = [
  'sante',
  'energie',
  'transports',
  'telecom',
  'defense',
  'institutionnel',
  'commerce',
  'assurance',
  'sport',
  'emploi',
  'logistique',
  'autre',
] as const;

export type Secteur = (typeof secteurs)[number];

export const facteursAggravant = ['reputation', 'subco', 'rd', 'ot', 'geo'] as const;
export type FacteurAggravant = (typeof facteursAggravant)[number];
