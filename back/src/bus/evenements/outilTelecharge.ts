export type Outil =
  | 'Modèle_annuaire_crise'
  | 'Rappel_mise-à-jour_annuaire'
  | 'Modèle_modification_mots_de_passe'
  | 'modele-liste-d-activites.xlsx';

export class OutilTéléchargé {
  constructor(
    readonly email: string,
    readonly outil: Outil
  ) {}
}
