export type DonneeObservatoire<T> = T & {
  source: string;
  date: Date | null;
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

export type TotalParNiveauMaturite = { niveau: string; total: number };

export type DonneesObservatoireOrganisations = {
  testsMaturite: DonneeObservatoire<{
    total: number;
    parNiveau: TotalParNiveauMaturite[];
  }>;
};
