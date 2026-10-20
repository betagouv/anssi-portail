export class OutilTéléchargé {
  constructor(
    readonly email: string,
    readonly outil: 'Modèle_annuaire_crise' | 'Rappel_mise-à-jour_annuaire' | 'Modèle_modification_mots_de_passe'
  ) {}
}
