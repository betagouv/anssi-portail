export type FiltresObservatoire = {
  region?: string;
  departement?: string;
  secteurActivite?: string;
  typeOrganisation?: string;
};

export interface AdaptateurObservatoire {
  totalServices(filtres: FiltresObservatoire): Promise<number>;
}
