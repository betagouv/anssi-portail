const outils = [
  'modele-annuaire-de-crise.xlsx',
  'rappel-mise-a-jour-annuaire-contacts.ics',
  'modele-modifications-mots-de-passe.xlsx',
  'modele-liste-d-activites.xlsx',
  'rappel-mise-a-jour-liste-d-activites.ics',
  'modele-revue-comptes-utilisateurs.xlsx',
  'modele-revue-droits-d-acces.xlsx',
] as const;
export type Outil = (typeof outils)[number];

export const estUnOutil = (valeur: unknown): valeur is Outil => {
  return typeof valeur === 'string' && outils.includes(valeur as Outil);
};
