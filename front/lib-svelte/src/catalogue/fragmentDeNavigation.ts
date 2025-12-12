type ExtraisValeur = {
  <T>(cle: string): T | undefined;
  <T>(cle: string, defaut: T): T;
  <T, U = T | null>(cle: string, defaut: U): T | U | null;
};

export type FragmentDeNavigation = {
  section?: string;
  extraisTableau: <T>(cle: string) => T[];
  extraisValeur: ExtraisValeur;
};

export const creeLeFragmentDeNavigation = (
  hash: string
): FragmentDeNavigation => {
  const [section, reste] = hash.slice(1).split('?');
  const filtres: Record<string, string[]> = {};
  const parametres = new URLSearchParams(reste);
  for (const [cle, valeur] of parametres.entries()) {
    if (valeur) filtres[cle] = valeur.split(',').filter((v) => !!v);
  }
  return {
    section: section || undefined,
    extraisTableau: <T>(cle: string): T[] =>
      filtres[cle]?.map((valeur: string) => valeur as unknown as T) ?? [],
    extraisValeur: <T, U = T | null>(
      cle: string,
      defaut?: U
    ): T | U | undefined | null =>
      (filtres[cle]?.[0] as unknown as T) ?? defaut,
  };
};
