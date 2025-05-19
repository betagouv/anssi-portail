type ElementSerie = {
  valeur: number;
  libelle: string;
};
export type Serie = ElementSerie[];

export const totalSerie = (serie: Serie) =>
  serie.reduce((valeurCumulee, element) => valeurCumulee + element.valeur, 0);

export const pourcentagesSerie = (serie: Serie) =>
  serie.map((d) => (d.valeur / totalSerie(serie)) * 100);
