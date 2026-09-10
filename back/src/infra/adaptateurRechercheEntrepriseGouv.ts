import axios, { AxiosError } from '@anssi-portail/axios';
import { regions } from '../metier/referentielRegions.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { AdaptateurRechercheEntreprise, ResultatRechercheEntreprise } from './adaptateurRechercheEntreprise.js';

import { Cache } from './cache.js';

const TRENTE_MINUTES = 60 * 30;

export class AdaptateurRechercheEntrepriseGouv implements AdaptateurRechercheEntreprise {
  cache: Cache<ResultatRechercheEntreprise[]>;
  private readonly apiUrl: string;

  constructor(adaptateurEnvironnement: AdaptateurEnvironnement) {
    this.cache = new Cache({ ttl: TRENTE_MINUTES });
    const apiUrl = adaptateurEnvironnement.rechercheEntreprise().apiUrl();
    this.apiUrl = apiUrl;
  }

  async rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]> {
    return this.cache.get(`${terme}-${departement}`, () => {
      return this.rechercheOrganisationsInterne(terme, departement);
    });
  }

  async rechercheOrganisationsInterne(
    terme: string,
    departement: string | null
  ): Promise<ResultatRechercheEntreprise[]> {
    try {
      const reponse = await axios.get<{ results: ResultatSirene[] }>(this.apiUrl, {
        params: {
          q: terme,
          ...(departement && { departement }),
          per_page: 25,
          page: 1,
          limite_matching_etablissements: 1,
          est_entrepreneur_individuel: false,
          mtm_campaign: 'mes-services-cyber',
        },
      });

      return reponse.data.results.flatMap((r) => extraisInfosEtablissement(terme, r) ?? []);
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
}

const extraisDepartement = (commune: string | null | undefined) => {
  if (!commune) {
    return null;
  }

  return commune.startsWith('97') || commune.startsWith('98') ? commune.slice(0, 3) : commune.slice(0, 2);
};

const extraisInfosEtablissement = (
  terme: string,
  resultat: ResultatSirene
): ResultatRechercheEntreprise | undefined => {
  let nom = resultat.nom_complet;
  const { departement, siret } = resultat.siege;
  let departementRetour = departement;
  let siretRetour = siret;

  const estUneRechercheParSiret = terme.match('^[0-9 ]+$');

  if (estUneRechercheParSiret) {
    const etablissement = resultat.matching_etablissements?.[0];
    if (!etablissement?.commune || !etablissement.siret) return undefined;

    nom = etablissement.liste_enseignes?.[0] ?? nom;
    departementRetour = extraisDepartement(etablissement.commune);
    siretRetour = etablissement.siret;
  }

  if (!departementRetour || !siretRetour) return undefined;

  const codeRegion = regions.find((region) => region.codeINSEE === resultat.siege.region)?.codeIso;

  return {
    nom,
    departement: departementRetour,
    siret: siretRetour,
    codeRegion,
    codeSecteur: resultat.section_activite_principale ?? undefined,
    codeTrancheEffectif: resultat.tranche_effectif_salarie ?? undefined,
    estAssociation: resultat.complements.est_association,
    estCollectivite: Boolean(resultat.complements.collectivite_territoriale),
    codeActivite: resultat.activite_principale,
  };
};

// https://recherche-entreprises.api.gouv.fr/docs/
type ResultatSirene = {
  nom_complet: string;
  siege: {
    departement?: string | null;
    siret?: string | null;
    region?: string | null;
  };
  matching_etablissements?: {
    liste_enseignes?: string[] | null;
    commune?: string | null;
    siret?: string | null;
  }[];
  section_activite_principale: string | null; // contrairement à ce que dit la documentation, null est possible
  tranche_effectif_salarie: string | null; // contrairement à ce que dit la documentation, null est possible
  complements: {
    collectivite_territoriale: {
      code_insee: string;
    } | null;
    est_association: boolean;
  };
  activite_principale: string;
};
