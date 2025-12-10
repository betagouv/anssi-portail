import { BesoinCyber } from './besoinCyber';
import { EntrepotGuide } from './entrepotGuide';

export class Guide {
  id: string;
  nom: string;
  description: string;
  nomImage: string | null;
  langue: 'FR' | 'EN';
  collections: string[];
  documents: DocumentGuide[];
  datePublication: string;
  dateMiseAJour: string;
  thematique: string;
  besoins: BesoinCyber[];

  constructor(parametres: {
    id: string;
    nom: string;
    description: string;
    nomImage: string | null;
    langue: 'FR' | 'EN';
    collections: string[];
    documents: DocumentGuide[];
    datePublication: string;
    dateMiseAJour: string;
    thematique: string;
    besoins: BesoinCyber[];
  }) {
    this.id = parametres.id;
    this.nom = parametres.nom;
    this.description = parametres.description;
    this.nomImage = parametres.nomImage;
    this.langue = parametres.langue;
    this.collections = parametres.collections;
    this.documents = parametres.documents;
    this.datePublication = parametres.datePublication;
    this.dateMiseAJour = parametres.dateMiseAJour;
    this.thematique = parametres.thematique;
    this.besoins = parametres.besoins;
  }

  async deMemesCollections(entrepotGuide: EntrepotGuide) {
    return (await entrepotGuide.parCollections(this.collections)).filter(
      (guide) => guide.id !== this.id
    );
  }
}

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
