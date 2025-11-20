export type Guide = {
  id: string;
  nom: string;
  resume: string;
  description: string;
  nomImage: string;
  langue: 'FR' | 'EN';
  collections: string[];
};
