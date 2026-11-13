export type StockageDeSession = typeof stockageDeSession;

export const stockageDeSession = {
  getItem: (clé: string): string | null => {
    return sessionStorage.getItem(clé);
  },
  setItem: (clé: string, valeur: string): void => {
    sessionStorage.setItem(clé, valeur);
  },
  supprimeItem: (clé: string): void => {
    sessionStorage.removeItem(clé);
  },
  efface: (): void => {
    sessionStorage.clear();
  },
};
