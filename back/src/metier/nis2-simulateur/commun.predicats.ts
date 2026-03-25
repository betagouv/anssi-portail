type Predicat<T> = (donnees: T) => boolean;


export const toujoursVrai = () => true;
export const toujoursFaux = () => false;
export const toujourNegatif = () => -1;

export const est: <T>(cherche: T) => (compare: T) => boolean =
  <T>(cherche: T) =>
  (compare: T) =>
    compare === cherche;

export const contientUnParmi: <T>(
  ...listeCherche: T[]
) => (listeCompare: T[]) => boolean =
  <T>(...listeCherche: T[]) =>
  (listeCompare: T[]) =>
    listeCompare.some((compare) => listeCherche.includes(compare));

export const non: <T>(
  ...predicats: Array<Predicat<T>>
) => (donnees: T) => boolean =
  <T>(predicat: Predicat<T>) =>
  (donnees: T) =>
    !predicat(donnees);

export const et: <T>(
  ...predicats: Array<Predicat<T>>
) => (donnees: T) => boolean =
  <T>(...predicats: Array<Predicat<T>>) =>
  (donnees: T) =>
    predicats.every((p) => p(donnees));

export const ou: <T>(
  ...predicats: Array<Predicat<T>>
) => (donnees: T) => boolean =
  <T>(...predicats: Array<Predicat<T>>) =>
  (donnees: T) =>
    predicats.some((p) => p(donnees));
