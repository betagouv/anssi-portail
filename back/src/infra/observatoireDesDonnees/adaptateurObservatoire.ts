export type FiltresObservatoire = {
  region?: string;
  departement?: string;
  secteurActivite?: string;
  typeOrganisation?: string;
};

export type CumulMensuel = { mois: string; cumul: number };

export interface AdaptateurObservatoire {
  totalServices(filtres: FiltresObservatoire): Promise<number>;
  cumulMensuelServices(filtres: FiltresObservatoire): Promise<CumulMensuel[]>;
}
