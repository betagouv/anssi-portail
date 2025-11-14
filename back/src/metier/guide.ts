export type Guide = {
  id: string;
  titre: string;
  lienVignette: string;
  langue: 'FR' | 'EN';
  collections: string[];
};
