export const regions = [
  { codeINSEE: '84', codeIso: 'FR-ARA', nom: 'Auvergne-Rhône-Alpes' },
  { codeINSEE: '27', codeIso: 'FR-BFC', nom: 'Bourgogne-Franche-Comté' },
  { codeINSEE: '53', codeIso: 'FR-BRE', nom: 'Bretagne' },
  { codeINSEE: '24', codeIso: 'FR-CVL', nom: 'Centre-Val de Loire' },
  { codeINSEE: '', codeIso: 'FR-COM', nom: "Collectivités d'Outre-Mer" },
  { codeINSEE: '94', codeIso: 'FR-20R', nom: 'Corse' },
  { codeINSEE: '44', codeIso: 'FR-GES', nom: 'Grand Est' },
  { codeINSEE: '32', codeIso: 'FR-HDF', nom: 'Hauts-de-France' },
  { codeINSEE: '11', codeIso: 'FR-IDF', nom: 'Ile-de-France' },
  { codeINSEE: '75', codeIso: 'FR-NAQ', nom: 'Nouvelle-Aquitaine' },
  { codeINSEE: '28', codeIso: 'FR-NOR', nom: 'Normandie' },
  { codeINSEE: '76', codeIso: 'FR-OCC', nom: 'Occitanie' },
  { codeINSEE: '52', codeIso: 'FR-PDL', nom: 'Pays de la Loire' },
  { codeINSEE: '93', codeIso: 'FR-PAC', nom: "Provence-Alpes-Côte d'Azur" },
  { codeINSEE: '1', codeIso: 'FR-971', nom: 'Guadeloupe' },
  { codeINSEE: '3', codeIso: 'FR-973', nom: 'Guyane' },
  { codeINSEE: '2', codeIso: 'FR-972', nom: 'Martinique' },
  { codeINSEE: '6', codeIso: 'FR-976', nom: 'Mayotte' },
  { codeINSEE: '4', codeIso: 'FR-974', nom: 'La Réunion' },
  { codeINSEE: '988', codeIso: 'FR-NC', nom: 'Nouvelle-Calédonie' },
  { codeINSEE: '987', codeIso: 'FR-PF', nom: 'Polynésie française' },
  { codeINSEE: '975', codeIso: 'FR-PM', nom: 'Saint-Pierre-et-Miquelon' },
  { codeINSEE: '977', codeIso: 'FR-BL', nom: 'Saint-Barthélemy' },
  { codeINSEE: '978', codeIso: 'FR-MF', nom: 'Saint-Martin' },
  { codeINSEE: '986', codeIso: 'FR-WF', nom: 'Wallis-et-Futuna' },
  {
    codeINSEE: '98O',
    codeIso: 'FR-TF',
    nom: 'Terres australes et antarctiques françaises',
  },
  { codeINSEE: '989', codeIso: 'FR-CP', nom: 'Île de Clipperton' },
] as const;

export const codesRegion = regions.map((s) => s.codeIso);

export type CodeRegion = (typeof codesRegion)[number];
export type Region = (typeof regions)[number];

export function regionParCode(code: CodeRegion): Region;
export function regionParCode(code: string | undefined): Region | undefined;
export function regionParCode(code: string | undefined) {
  return regions.find((region) => region.codeIso === code);
}

export function estCodeRegion(code: string | undefined): code is CodeRegion {
  return regions.some((region) => region.codeIso === code);
}

export function regionParNom(nom: string): Region | undefined {
  return regions.find(
    (region) =>
      region.nom.toLocaleLowerCase().trim() === nom.toLocaleLowerCase().trim()
  );
}
