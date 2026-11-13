export type StockageDeSession = typeof stockageDeSession;

const _stockageDeSession = () => {
  try {
    return sessionStorage;
  } catch {
    return null;
  }
};

export const stockageDeSession = {
  getItem: (clé: string): string | null => _stockageDeSession()?.getItem(clé) ?? null,
  setItem: (clé: string, valeur: string): void => _stockageDeSession()?.setItem(clé, valeur),
  supprimeItem: (clé: string): void => _stockageDeSession()?.removeItem(clé),
  efface: (): void => _stockageDeSession()?.clear(),
};
