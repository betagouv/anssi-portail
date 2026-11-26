type DonneeObservatoire<T> = T & {
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

export type TotalParDepartement = { departement: string; total: number };

export type RepartitionParDepartement = { code: string; nom: string; total: number }[];

export const SEUILS_COMPLETION = [50, 80, 100] as const;

export type SeuilCompletion = (typeof SEUILS_COMPLETION)[number];

export type DonneesObservatoireOrganisations = {
  testsMaturite: DonneeObservatoire<{
    total: number;
    parNiveau: TotalParNiveauMaturite[];
  }>;
  testsSensibilisation: DonneeObservatoire<{ total: number; cumulMensuel: CumulMensuel[] }>;
  demarchesInitiees: DonneeObservatoire<{ total: number }>;
  diagnosticsCyberdepart: DonneeObservatoire<{ total: number }>;
  cyberdepartsValides: DonneeObservatoire<{
    total: number;
    cumulMensuel: CumulMensuel[];
    parDepartement: RepartitionParDepartement;
  }>;
  completions: DonneeObservatoire<{
    parSeuil: {
      seuil: SeuilCompletion;
      total: number;
      cumulMensuel: CumulMensuel[];
      parDepartement: RepartitionParDepartement;
    }[];
  }>;
};
