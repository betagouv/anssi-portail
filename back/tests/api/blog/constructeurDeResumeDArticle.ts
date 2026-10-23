import { Article } from '../../../src/metier/blog/article.js';
import { RésuméArticle } from '../../../src/metier/blog/resumeArticle.js';

export class ConstructeurDArticleAvecToutesLesMétadonnées {
  private contenu: string = '<div>Contenu</div>';
  private description: string = 'Une description';
  private id: string = '01a0f7a4-d912-725a-a090-b92bdf8c8c8b';
  private slug: string = 'slug';
  private titre: string = 'Titre';

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
      description: this.description,
      id: this.id,
      slug: this.slug,
      titre: this.titre,
      tableDesMatières: [],
    };
  }
}
