type Predicat<T> = (donnees: T) => boolean;

export const contientUnParmi: <T>(...listeCherche: T[]) => (listeCompare: T[]) => boolean =
  <T>(...listeCherche: T[]) =>
  (listeCompare: T[]) =>
    listeCompare.some((compare) => listeCherche.includes(compare));

export const non: <T>(...predicats: Array<Predicat<T>>) => (donnees: T) => boolean =
  <T>(predicat: Predicat<T>) =>
  (donnees: T) =>
    !predicat(donnees);

export const ou: <T>(...predicats: Array<Predicat<T>>) => (donnees: T) => boolean =
  <T>(...predicats: Array<Predicat<T>>) =>
  (donnees: T) =>
    predicats.some((p) => p(donnees));
