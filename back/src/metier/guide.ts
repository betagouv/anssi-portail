export type Guide = {
  id: string;
  nom: string;
  resume: string;
  description: string;
  illustration: string;
  langue: 'FR' | 'EN';
  collections: string[];
};
