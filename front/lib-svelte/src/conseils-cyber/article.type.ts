export class Article {
  readonly contenu: string;
  readonly description: string;
  private readonly dateDeMiseÀJour: Date | undefined;
  private readonly dateDePublication: Date | undefined;
  readonly titre: string;
  constructor({
    contenu,
    description,
    dateDeMiseÀJour,
    dateDePublication,
    titre,
  }: {
    contenu: string;
    description: string;
    dateDeMiseÀJour: string | undefined;
    dateDePublication: string | undefined;
    titre: string;
  }) {
    this.contenu = contenu;
    this.description = description;
    this.titre = titre;
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
