import { RésuméArticle } from '../../../src/metier/blog/resumeArticle.js';

export class ConstructeurDeRésuméDArticle {
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

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  construis(): RésuméArticle {
    return {
      id: this.id,
      slug: this.slug,
      titre: this.titre,
    };
  }
}
