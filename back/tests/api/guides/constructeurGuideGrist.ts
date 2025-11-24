import { GuideGrist } from '../../../src/infra/entrepotGuideGrist';
import { DocumentGuide } from '../../../src/metier/guide';

export class ConstructeurGuideGrist {
  private numeroDeLigne: number = 0;
  private identifiant: string | null = null;
  private titre: string | null = null;
  private resume: string | null = null;
  private description: string | null = null;
  private image: string | null = null;
  private langue: 'FR' | 'EN' | null = null;
  private collections: string[] = [];
  private documents: DocumentGuide[] = [];
  private datePublication: string | null = null;
  private dateMiseAJour: string | null = null;

  avecLeNumeroDeLigne(numerodeLigne: number) {
    this.numeroDeLigne = numerodeLigne;
    return this;
  }

  avecLIdentifiant(identifiant: string) {
    this.identifiant = identifiant;
    return this;
  }

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  avecLeResume(resume: string) {
    this.resume = resume;
    return this;
  }

  avecLaDescription(description: string) {
    this.description = description;
    return this;
  }

  avecLImage(image: string | null) {
    this.image = image;
    return this;
  }

  avecLaLangue(langue: 'FR' | 'EN') {
    this.langue = langue;
    return this;
  }

  avecLesCollections(collections: string[]) {
    this.collections = [...collections];
    return this;
  }

  avecLeDocument(libelle: string, nomFichier: string) {
    this.documents.push({ libelle, nomFichier });
    return this;
  }
  avecLaDateDePublication(datePublication: string) {
    this.datePublication = datePublication;
    return this;
  }
  avecLaDateDeMiseAJour(dateMiseAJour: string) {
    this.dateMiseAJour = dateMiseAJour;
    return this;
  }

  construis() {
    return {
      id: this.numeroDeLigne,
      fields: {
        Identifiant: this.identifiant,
        Titre: this.titre,
        Resume: this.resume,
        Description: this.description,
        Image: this.image,
        Langue: this.langue,
        Collections: this.collections,
        Documents: this.documents
          .map((document) => `${document.libelle} : ${document.nomFichier}`)
          .join('\n'),
        Date_de_publication: this.datePublication,
        Date_de_mise_a_jour: this.dateMiseAJour,
      },
    } satisfies GuideGrist;
  }
}
