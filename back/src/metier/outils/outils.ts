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
  'modele-liste-interconnexions.xlsx',
  'modele-inventaire-composants-obsoletes.xlsx',
  'modele-analyse-de-conformite.xlsx',
  'modele-cartographie.xlsx',
  'rappel-mise-a-jour-liste-prestataires-et-fournisseurs.ics',
  'rappel-mise-a-jour-liste-interconnexions.ics',
  'rappel-mise-a-jour-inventaire-composants-obsoletes.ics',
  'modele-suivi-des-arrivees.docx',
  'modele-suivi-de-changement-de-fonction.docx',
] as const;
export type Outil = (typeof outils)[number];

export const estUnOutil = (valeur: unknown): valeur is Outil => {
  return typeof valeur === 'string' && outils.includes(valeur as Outil);
};
