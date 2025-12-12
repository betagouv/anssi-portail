type ExtraisValeur = {
  <T>(cle: string): T | undefined;
  <T>(cle: string, defaut: T): T;
  <T, U = T | null>(cle: string, defaut: U): T | U | null;
};

export type FragmentDeNavigation = {
  section?: string;
  change: <T>(cle: string, valeur: T | T[]) => void;
  changeSection: (section: string) => void;
  extraisTableau: <T>(cle: string) => T[];
  extraisValeur: ExtraisValeur;
  serialise(): string;
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
  let sectionEffective = section || undefined;
  return {
    section: sectionEffective,
    change: <T>(cle: string, valeur: T | T[]) => {
      const tmp = Array.isArray(valeur) ? valeur : valeur ? [valeur] : [];
      filtres[cle] = tmp.map((valeur) => valeur as unknown as string);
    },
    changeSection: (section: string) => {
      sectionEffective = section;
    },
    extraisTableau: <T>(cle: string): T[] =>
      filtres[cle]?.map((valeur: string) => valeur as unknown as T) ?? [],
    extraisValeur: <T, U = T | null>(
      cle: string,
      defaut?: U
    ): T | U | undefined | null =>
      (filtres[cle]?.[0] as unknown as T) ?? defaut,
    serialise: (): string => {
      const chaineFiltres = Object.entries(filtres)
        .map(([k, v]) => {
          if (!v) return undefined;
          const valeurs = Array.isArray(v) ? v : [v];
          return valeurs.length > 0 ? `${k}=${valeurs.join(',')}` : undefined;
        })
        .filter((v) => !!v)
        .join('&');
      return (
        '#' +
        (sectionEffective ?? '') +
        (chaineFiltres.length ? `?${chaineFiltres}` : '')
      );
    },
  };
};
