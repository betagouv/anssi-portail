const outils = ['modele-annuaire-de-crise.xlsx', 'rappel-mise-a-jour-annuaire-contacts.ics'] as const;
export type Outil = (typeof outils)[number];

export const estUnOutil = (valeur: unknown): valeur is Outil => {
  return typeof valeur === 'string' && outils.includes(valeur as Outil);
};
