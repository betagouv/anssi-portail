export type EntréeTableDesMatières = {
  id: string;
  texte: string;
  profondeur: number;
};

export class Article {
  readonly contenu: string;
  readonly description: string;
  private readonly dateDeMiseÀJour: Date | undefined;
  private readonly dateDePublication: Date | undefined;
  readonly titre: string;
  readonly tableDesMatières: EntréeTableDesMatières[];
  constructor({
    contenu,
    description,
    dateDeMiseÀJour,
    dateDePublication,
    titre,
    tableDesMatières,
  }: {
    contenu: string;
    description: string;
    dateDeMiseÀJour: Date | undefined;
    dateDePublication: Date | undefined;
    titre: string;
    tableDesMatières: EntréeTableDesMatières[];
  }) {
    this.contenu = contenu;
    this.description = description;
    this.titre = titre;
    this.tableDesMatières = tableDesMatières;
    try {
      this.dateDeMiseÀJour = dateDeMiseÀJour ? new Date(dateDeMiseÀJour) : undefined;
    } catch {
      this.dateDeMiseÀJour = undefined;
    }
    try {
      this.dateDePublication = dateDePublication ? new Date(dateDePublication) : undefined;
    } catch {
      this.dateDePublication = undefined;
    }
  }

  publicationOuMiseÀJourFormattée(): string | undefined {
    if (!this.dateDePublication) {
      return undefined;
    }

    const débutDeJournée = (date: Date) => new Date(date).setHours(0, 0, 0, 0);

    if (this.dateDeMiseÀJour && débutDeJournée(this.dateDeMiseÀJour) > débutDeJournée(this.dateDePublication)) {
      return `Mis à jour le ${this.dateDeMiseÀJour.toLocaleDateString()}`;
    }

    return `Publié le ${this.dateDePublication.toLocaleDateString()}`;
  }
}
