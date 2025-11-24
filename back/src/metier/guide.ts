export type Guide = {
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
};

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
