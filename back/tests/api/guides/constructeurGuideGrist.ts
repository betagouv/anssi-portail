import { GuideGrist } from '../../../src/infra/entrepotGuideGrist';
import { DocumentGuide } from '../../../src/metier/guide';

export class ConstructeurGuideGrist {
  private numeroDeLigne: number = 0;
  private identifiant: string | null = null;
  private titre: string | null = null;
  private description: string | null = null;
  private langue: 'FR' | 'EN' | null = null;
  private collections: string[] = [];
  private readonly documents: DocumentGuide[] = [];
  private readonly listeDocuments: DocumentGuide[] = [];
  private documentsBruts: string | null = null;
  private dateMiseAJour: number | null = null;
  private thematique: string | null = null;
  private readonly besoins: string[] = [];

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

  avecLaDescription(description: string) {
    this.description = description;
    return this;
  }

  avecLaLangue(langue: 'FR' | 'EN') {
    this.langue = langue;
    return this;
  }

  avecLesCollections(collections: string[]) {
    this.collections = ['L', ...collections];
    return this;
  }

  avecLeDocument(libelle: string, nomFichier: string) {
    this.documents.push({ libelle, nomFichier });
    return this;
  }

  avecLaChaineDeDocument(chaineDocument: string) {
    this.documentsBruts = chaineDocument;
    return this;
  }

  avecLaDateDeMiseAJour(dateMiseAJour: number) {
    this.dateMiseAJour = dateMiseAJour;
    return this;
  }

  avecThematique(thematique: string) {
    this.thematique = thematique;
    return this;
  }

  avecBesoin(besoin: string) {
    this.besoins.push(besoin);
    return this;
  }

  construis() {
    return {
      id: this.numeroDeLigne,
      fields: {
        Identifiant: this.identifiant,
        Titre: this.titre,
        Description: this.description,
        Langue: this.langue,
        Collections: this.collections,
        Documents: this.documentsBruts
          ? this.documentsBruts
          : this.documents.map((document) => `${document.libelle} : ${document.nomFichier}`).join('\n'),
        Liste_documents: JSON.stringify(this.listeDocuments),
        Date_de_mise_a_jour_s_: this.dateMiseAJour,
        Thematique: this.thematique,
        Besoins_cyber: this.besoins.length ? ['L', ...this.besoins] : [],
      },
    } satisfies GuideGrist;
  }
}
