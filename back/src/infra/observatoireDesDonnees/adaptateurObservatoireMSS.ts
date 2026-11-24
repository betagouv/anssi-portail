export type FiltresObservatoire = {
  region?: string;
  departement?: string;
  secteurActivite?: string;
  typeOrganisation?: string;
};

export type CumulMensuel = { mois: string; cumul: number };

export type TotalMensuel = { mois: string; total: number };

export type TotalParNiveauSecurite = { niveauSecurite: string; total: number };

export interface AdaptateurObservatoireMSS {
  totalServices(filtres: FiltresObservatoire): Promise<number>;
  cumulMensuelServices(filtres: FiltresObservatoire): Promise<CumulMensuel[]>;
  mesuresFaitesParMois(filtres: FiltresObservatoire): Promise<TotalMensuel[]>;
  servicesParNiveauSecurite(filtres: FiltresObservatoire): Promise<TotalParNiveauSecurite[]>;
  cumulMensuelHomologations(filtres: FiltresObservatoire): Promise<CumulMensuel[]>;
  dateDerniereExecution(): Promise<Date | null>;
}
