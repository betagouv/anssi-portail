export const secteurs = [
  { code: 'A', libelle: 'Agriculture, sylviculture et pêche' },
  { code: 'B', libelle: 'Industries extractives' },
  { code: 'C', libelle: 'Industrie manufacturière' },
  {
    code: 'D',
    libelle:
      "Production et distribution d'électricité, de gaz, de vapeur et d'air conditionné",
  },
  {
    code: 'E',
    libelle:
      "Production et distribution d'eau ; assainissement, gestion des déchets et dépollution",
  },
  { code: 'F', libelle: 'Construction' },
  {
    code: 'G',
    libelle: "Commerce ; réparation d'automobiles et de motocycles",
  },
  { code: 'H', libelle: 'Transports et entreposage' },
  { code: 'I', libelle: 'Hébergement et restauration' },
  { code: 'J', libelle: 'Information et communication' },
  { code: 'K', libelle: "Activités financières et d'assurance" },
  { code: 'L', libelle: 'Activités immobilières' },
  {
    code: 'M',
    libelle: 'Activités spécialisées, scientifiques et techniques',
  },
  {
    code: 'N',
    libelle: 'Activités de services administratifs et de soutien',
  },
  { code: 'O', libelle: 'Administration publique' },
  { code: 'P', libelle: 'Enseignement' },
  { code: 'Q', libelle: 'Santé humaine et action sociale' },
  { code: 'R', libelle: 'Arts, spectacles et activités récréatives' },
  { code: 'S', libelle: 'Autres activités de services' },
  {
    code: 'T',
    libelle:
      "Activités des ménages en tant qu'employeurs ; activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre",
  },
  { code: 'U', libelle: 'Activités extra-territoriales' },
  { code: 'ASSOCIATIONS', libelle: 'Associations' },
  { code: 'COLLECTIVITES', libelle: 'Collectivités' },
] as const;

export const codesSecteur = secteurs.map((s) => s.code);

export type CodeSecteur = (typeof codesSecteur)[number];
export type Secteur = (typeof secteurs)[number];

export function secteurParCode(code: CodeSecteur): Secteur;
export function secteurParCode(code: string | undefined): Secteur | undefined;
export function secteurParCode(code: string | undefined) {
  return secteurs.find((secteur) => secteur.code === code);
}

export function estCodeSecteur(code: string | undefined): code is CodeSecteur {
  return secteurs.some((secteur) => secteur.code === code);
}
