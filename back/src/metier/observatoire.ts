export type DonneeObservatoire<T> = T & {
  source: string;
  date: Date;
};

export type FiltresObservatoire = {
  region?: string;
  departement?: string;
  secteurActivite?: string;
  typeOrganisation?: string;
};

export type CumulMensuel = { mois: string; cumul: number };

export type TotalMensuel = { mois: string; total: number };

export type TotalParNiveauSecurite = { niveauSecurite: string; total: number };

export type DonneesObservatoireProjets = {
  services: DonneeObservatoire<{
    total: number;
    cumulMensuel: CumulMensuel[];
    parNiveauSecurite: TotalParNiveauSecurite[];
  }>;
  mesuresFaites: DonneeObservatoire<{ parMois: TotalMensuel[] }>;
  homologations: DonneeObservatoire<{ cumulMensuel: CumulMensuel[] }>;
};
