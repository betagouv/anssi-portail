export class Guide {
  id: string;
  nom: string;
  resume: string;
  description: string;
  nomImage: string | null;
  langue: 'FR' | 'EN';
  collections: string[];
  documents: DocumentGuide[];
  datePublication: string;
  dateMiseAJour: string;

  constructor(parametres: {
    id: string;
    nom: string;
    resume: string;
    description: string;
    nomImage: string | null;
    langue: 'FR' | 'EN';
    collections: string[];
    documents: DocumentGuide[];
    datePublication: string;
    dateMiseAJour: string;
  }) {
    this.id = parametres.id;
    this.nom = parametres.nom;
    this.resume = parametres.resume;
    this.description = parametres.description;
    this.nomImage = parametres.nomImage;
    this.langue = parametres.langue;
    this.collections = parametres.collections;
    this.documents = parametres.documents;
    this.datePublication = parametres.datePublication;
    this.dateMiseAJour = parametres.dateMiseAJour;
  }
}

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
