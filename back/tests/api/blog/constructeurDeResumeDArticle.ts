import { Article } from '../../../src/metier/blog/article.js';
import { RésuméArticle } from '../../../src/metier/blog/resumeArticle.js';

export class ConstructeurDArticleAvecToutesLesMétadonnées {
  private contenu: string = '<div>Contenu</div>';
  private dateDeMiseÀJour: Date = new Date();
  private dateDePublication: Date = new Date();
  private description: string = 'Une description';
  private estPublie: boolean = true;
  private id: string = '01a0f7a4-d912-725a-a090-b92bdf8c8c8b';
  private slug: string = 'slug';
  private titre: string = 'Titre';

  publié(estPublie: boolean) {
    this.estPublie = estPublie;
    return this;
  }

  avecLID(id: string) {
    this.id = id;
    return this;
  }

  avecLeSlug(slug: string) {
    this.slug = slug;
    return this;
  }

  avecLeContenu(contenu: string) {
    this.contenu = contenu;
    return this;
  }

  avecLaDateDeMiseÀJour(date: Date) {
    this.dateDeMiseÀJour = date;
    return this;
  }

  avecLaDateDePublication(date: Date) {
    this.dateDePublication = date;
    return this;
  }

  avecLaDescription(description: string) {
    this.description = description;
    return this;
  }

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  construis(): Article & RésuméArticle {
    return {
      contenu: this.contenu,
      dateDeMiseÀJour: this.dateDeMiseÀJour,
      dateDePublication: this.dateDePublication,
      description: this.description,
      estPublie: this.estPublie,
      id: this.id,
      slug: this.slug,
      titre: this.titre,
    };
  }
}
