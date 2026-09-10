export type ResultatRechercheEntreprise = {
  nom: string;
  departement: string | null;
  siret: string;
  codeTrancheEffectif: string | undefined;
  codeSecteur: string | undefined;
  codeRegion: string | undefined;
  estCollectivite: boolean;
  estAssociation: boolean;
  codeActivite: string;
};

export interface AdaptateurRechercheEntreprise {
  rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]>;
}
