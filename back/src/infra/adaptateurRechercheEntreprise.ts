export type ResultatRechercheEntreprise = {
  nom: string;
  departement: string | null;
  siret: string;
  codeTrancheEffectif: string | undefined;
  codeSecteur: string | undefined;
  codeRegion: string | undefined;
  estCollectivite: boolean;
  estAssociation: boolean;
  codeActivite: string | undefined; // code NAF 2025
};

export type OrganisationDetaillee = {
  natureJuridique: string | null;
  categorieEntreprise: 'PME' | 'ETI' | 'GE' | null;
  trancheEffectifSalarie: string | null;
  finances: Record<string, { ca: number | null; resultatNet: number | null }> | null;
  complements: {
    collectiviteTerritoriale: { code: string; niveau: string } | null;
    estAssociation: boolean;
    identifiantAssociation?: string | null;
    estAdministration?: boolean | null;
  };
  sectionActivitePrincipale: string | null;
  departement: string | null;
  region: string | null;
};

export interface AdaptateurRechercheEntreprise {
  rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]>;
  rechercheOrganisation(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise | undefined>;
  rechercheOrganisationDetaillee(siret: string): Promise<OrganisationDetaillee | undefined>;
}
