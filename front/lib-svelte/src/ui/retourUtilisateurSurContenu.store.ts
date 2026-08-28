export type RetourUtilisateur = {
  positif: boolean;
};

export const récupèreRetour = (clé: string): RetourUtilisateur | undefined => {
  const item = localStorage.getItem(clé);
  return item ? JSON.parse(item) : undefined;
};

export const supprimeRetour = (clé: string): void => {
  localStorage.removeItem(clé);
};

export const ajouteRetour = (clé: string, avis: RetourUtilisateur): void => {
  localStorage.setItem(clé, JSON.stringify({ positif: avis.positif }));
};
