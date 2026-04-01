import { BesoinCyber } from './besoinCyber';
import { EntrepotGuide } from './entrepotGuide';

export class Guide {
  id: string;
  nom: string;
  description: string;
  langue: 'FR' | 'EN';
  collections: string[];
  documents: DocumentGuide[];
  listeDocuments: DocumentGuide[];
  dateMiseAJour: Date;
  thematique: string;
  besoins: BesoinCyber[];

  constructor(parametres: {
    id: string;
    nom: string;
    description: string;
    langue: 'FR' | 'EN';
    collections: string[];
    documents: DocumentGuide[];
    listeDocuments: DocumentGuide[];
    dateMiseAJour: Date;
    thematique: string;
    besoins: BesoinCyber[];
  }) {
    this.id = parametres.id;
    this.nom = parametres.nom;
    this.description = parametres.description;
    this.langue = parametres.langue;
    this.collections = parametres.collections;
    this.documents = parametres.documents;
    this.listeDocuments = parametres.listeDocuments ?? [];
    this.dateMiseAJour = parametres.dateMiseAJour;
    this.thematique = parametres.thematique;
    this.besoins = parametres.besoins;
  }

  async deMemesCollections(entrepotGuide: EntrepotGuide) {
    return (await entrepotGuide.parCollections(this.collections)).filter((guide) => guide.id !== this.id);
  }

  estPublie = (): boolean => this.dateMiseAJour <= new Date();
}

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
