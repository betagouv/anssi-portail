import axios, { AxiosError } from 'axios';

export interface AdaptateurRechercheEntreprise {
  rechercheOrganisations(
    terme: string,
    departement: string | null
  ): Promise<ResultatRechercheEntreprise[]>;
}

export type ResultatRechercheEntreprise = {
  nom: string;
  departement: string | null;
  siret: string;
};

const extraisDepartement = (commune: string | undefined) => {
  if (!commune) {
    return null;
  }

  return commune.startsWith('97') || commune.startsWith('98')
    ? commune.slice(0, 3)
    : commune.slice(0, 2);
};

const extraisInfosEtablissement = (
  terme: string,
  resultat: ResultatSirene
): ResultatRechercheEntreprise => {
  let nom = resultat.nom_complet;
  const { departement, siret } = resultat.siege;
  let departementRetour: string | null = departement;
  let siretRetour = siret;

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
    departementRetour = extraisDepartement(
      resultat.matching_etablissements[0].commune
    );
    siretRetour = resultat.matching_etablissements[0].siret;
  }

  return {
    nom,
    departement: departementRetour,
    siret: siretRetour,
  };
};

// https://recherche-entreprises.api.gouv.fr/docs/
type ResultatSirene = {
  nom_complet: string;
  siege: {
    departement: string;
    siret: string;
  };
  matching_etablissements: {
    liste_enseignes: string[];
    commune: string;
    siret: string;
  }[];
};

export const adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise = {
  async rechercheOrganisations(
    terme: string,
    departement: string | null
  ): Promise<ResultatRechercheEntreprise[]> {
    try {
      const reponse = await axios.get(
        'https://recherche-entreprises.api.gouv.fr/search',
        {
          params: {
            q: terme,
            ...(departement && { departement }),
            per_page: 25,
            page: 1,
            limite_matching_etablissements: 1,
            est_entrepreneur_individuel: false,
            mtm_campaign: 'mes-services-cyber',
          },
        }
      );

      return reponse.data.results
        .filter((r: ResultatSirene) => r.siege.departement !== null)
        .map((r: ResultatSirene) => extraisInfosEtablissement(terme, r));
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
  },
};
