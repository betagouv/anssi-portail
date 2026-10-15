export const codesSecteurContact = [
  'aviation',
  'defense',
  'sante',
  'maritime',
  'enseignement-recherche',
  'social',
] as const;

export type CodeSecteurContact = (typeof codesSecteurContact)[number];

export const estCodeSecteurContact = (codeSecteur: string): codeSecteur is CodeSecteurContact => {
  return (codesSecteurContact as readonly string[]).includes(codeSecteur);
};
