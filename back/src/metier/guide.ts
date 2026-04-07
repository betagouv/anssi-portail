import { BesoinCyber } from './besoinCyber';
import { EntrepotGuide } from './entrepotGuide';
import { EntrepotGuideTravail } from './entrepotGuideTravail';

export class Guide {
  id: string;
  nom: string;
  description: string;
  langue: 'FR' | 'EN';
  collections: string[];
  listeDocuments: DocumentGuide[];
  nomsAnciensDocuments: string[];
  dateMiseAJour: Date;
  thematique: string;
  besoins: BesoinCyber[];

  constructor(parametres: {
    id: string;
    nom: string;
    description: string;
    langue: 'FR' | 'EN';
    collections: string[];
    listeDocuments: DocumentGuide[];
    nomsAnciensDocuments?: string[];
    dateMiseAJour: Date;
    thematique: string;
    besoins: BesoinCyber[];
  }) {
    this.id = parametres.id;
    this.nom = parametres.nom;
    this.description = parametres.description;
    this.langue = parametres.langue;
    this.collections = parametres.collections;
    this.listeDocuments = parametres.listeDocuments ?? [];
    this.nomsAnciensDocuments = parametres.nomsAnciensDocuments ?? [];
    this.dateMiseAJour = parametres.dateMiseAJour;
    this.thematique = parametres.thematique;
    this.besoins = parametres.besoins;
  }

  async deMemesCollections(entrepotGuide: EntrepotGuide) {
    return (await entrepotGuide.parCollections(this.collections)).filter((guide) => guide.id !== this.id);
  }

  estPublie = (): boolean => this.dateMiseAJour <= new Date();

  possedeLeDocument = (nomFichier: string): boolean => {
    return this.listeDocuments.some((document) => document.nomFichier === nomFichier);
  };

  ajouteLeDocument = (document: DocumentGuide) => {
    this.listeDocuments.push(document);
    this.nomsAnciensDocuments = this.nomsAnciensDocuments.filter((d) => d !== document.nomFichier);
  };

  supprimeLeDocument = (nomFichier: string): void => {
    if (!this.possedeLeDocument(nomFichier)) return;
    this.listeDocuments = this.listeDocuments.filter((document) => document.nomFichier !== nomFichier);
    this.nomsAnciensDocuments.push(nomFichier);
  };

  sauvegarde = async (entrepotGuideTravail: EntrepotGuideTravail): Promise<void> => {
    await entrepotGuideTravail.sauvegardeDocuments(this.id, this.listeDocuments, this.nomsAnciensDocuments);
  };
}

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
