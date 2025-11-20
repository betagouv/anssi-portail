export type Guide = {
  id: string;
  nom: string;
  resume: string;
  description: string;
  nomImage: string | null;
  langue: 'FR' | 'EN';
  collections: string[];
};
