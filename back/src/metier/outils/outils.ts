const outils = [
  'modele-annuaire-de-crise.xlsx',
  'rappel-mise-a-jour-annuaire-contacts.ics',
  'modele-modifications-mots-de-passe.xlsx',
  'modele-liste-d-activites.xlsx',
  'modele-raci.xlsx',
  'rappel-mise-a-jour-liste-d-activites.ics',
  'modele-revue-comptes-utilisateurs.xlsx',
  'modele-revue-droits-d-acces.xlsx',
  'campagne-de-sensibilisation',
  'modele-liste-prestataires-et-fournisseurs.xlsx',
  'rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics',
] as const;
export type Outil = (typeof outils)[number];

export const estUnOutil = (valeur: unknown): valeur is Outil => {
  return typeof valeur === 'string' && outils.includes(valeur as Outil);
};
