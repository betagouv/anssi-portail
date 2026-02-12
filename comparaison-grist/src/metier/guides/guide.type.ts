export type Guide = {
  id: string;
  nom: string;
  description: string;
  nomImage: string | null;
  langue: string;
  collections: string[];
  documents: DocumentGuide[];
  datePublication: string;
  dateMiseAJour: string;
  thematique: string;
  besoins: string[];
};

export type DocumentGuide = {
  libelle: string;
  nomFichier: string;
};
export type ComparaisonDeGuides = {
  ajouts: Guide[];
  suppressions: Guide[];
};
