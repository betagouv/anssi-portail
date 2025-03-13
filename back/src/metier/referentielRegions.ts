export const regions = [
  {codeIso: 'FR-ARA', nom: 'Auvergne-Rhône-Alpes'},
  {codeIso: 'FR-BFC', nom: 'Bourgogne-Franche-Comté'},
  {codeIso: 'FR-BRE', nom: 'Bretagne'},
  {codeIso: 'FR-CVL', nom: 'Centre-Val de Loire'},
  {codeIso: 'FR-20R', nom: 'Corse'},
  {codeIso: 'FR-GES', nom: 'Grand Est'},
  {codeIso: 'FR-971', nom: 'Guadeloupe'},
  {codeIso: 'FR-973', nom: 'Guyane'},
  {codeIso: 'FR-HDF', nom: 'Hauts-de-France'},
  {codeIso: 'FR-IDF', nom: 'Ile-de-France'},
  {codeIso: 'FR-972', nom: 'Martinique'},
  {codeIso: 'FR-976', nom: 'Mayotte'},
  {codeIso: 'FR-NAQ', nom: 'Nouvelle-Aquitaine'},
  {codeIso: 'FR-NOR', nom: 'Normandie'},
  {codeIso: 'FR-OCC', nom: 'Occitanie'},
  {codeIso: 'FR-PDL', nom: 'Pays de la Loire'},
  {codeIso: 'FR-PAC', nom: "Provence-Alpes-Côte d'Azur"},
  {codeIso: 'FR-974', nom: 'La Réunion'},
] as const;

export const codesRegion = regions.map((s) => s.codeIso);

export type CodeRegion = (typeof codesRegion)[number];
