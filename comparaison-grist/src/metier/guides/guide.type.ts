export type Guide = {
  id: string;
  nom: string;
  description: string;
  langue: string;
  collections: string[];
  documents: DocumentGuide[];
  dateMiseAJour: Date;
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
  modifications: { source: Guide; cible: Guide }[];
};
