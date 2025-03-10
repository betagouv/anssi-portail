import axios, {AxiosError} from "axios";

export interface AdaptateurRechercheEntreprise {
  rechercheOrganisations(terme: string,
                         departement: string | null): Promise<ResultatRechercheEntreprise[]>;
}

export type ResultatRechercheEntreprise = {
  nom: string,
  departement: string,
  siret: string,
}

const extraisDepartement = (commune: string | undefined) => {
  if (!commune) {
    return null;
  }

  return commune.startsWith('97') || commune.startsWith('98')
    ? commune.slice(0, 3)
    : commune.slice(0, 2);
};

const extraisInfosEtablissement = (terme: string, resultat: any): ResultatRechercheEntreprise => {
  let nom = resultat.nom_complet;
  let {departement, siret} = resultat.siege;

  const estUneRechercheParSiret = terme.match('^[0-9 ]+$');

  const aUnEtablissement =
    resultat.matching_etablissements &&
    resultat.matching_etablissements.length > 0;

  if (estUneRechercheParSiret && aUnEtablissement) {
    const aUneListeEnseigne =
      resultat.matching_etablissements[0].liste_enseignes &&
      resultat.matching_etablissements[0].liste_enseignes.length > 0;
    if (aUneListeEnseigne) {
      nom = resultat.matching_etablissements[0].liste_enseignes[0];
    }
    departement = extraisDepartement(
      resultat.matching_etablissements[0].commune
    );
    siret = resultat.matching_etablissements[0].siret;
  }

  return {
    nom,
    departement,
    siret,
  };
};

export const adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {

  async rechercheOrganisations(
    terme: string,
    departement: string | null,
  ): Promise<ResultatRechercheEntreprise[]> {
    try {
      const reponse = await axios.get(
        'https://recherche-entreprises.api.gouv.fr/search',
        {
          params: {
            q: terme,
            ...(departement && {departement}),
            per_page: 25,
            page: 1,
            limite_matching_etablissements: 1,
            est_entrepreneur_individuel: false,
            mtm_campaign: 'mes-services-cyber',
          },
        }
      );

      return reponse.data.results
        .filter((r: any) => r.siege.departement !== null)
        .map((r: any) => extraisInfosEtablissement(terme, r));
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e, {
          'Erreur renvoyee par API recherche-entreprise': e.response?.data,
          'Statut HTTP': e.response?.status,
        });
      } else {
        console.error(e);
      }

      return [];
    }
  }
};