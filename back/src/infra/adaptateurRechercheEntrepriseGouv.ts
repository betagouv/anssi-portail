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
    this.apiUrl = adaptateurEnvironnement.rechercheEntreprise().apiUrl();
  }

  async rechercheOrganisations(terme: string, département: string | null): Promise<ResultatRechercheEntreprise[]> {
    return this.cache.get(`${terme}-${département}`, () => {
      return this.rechercheOrganisationsInterne(terme, département);
    });
  }

  async rechercheOrganisationsInterne(
    terme: string,
    département: string | null
  ): Promise<ResultatRechercheEntreprise[]> {
    try {
      const réponse = await axios.get<{ results: RésultatSirene[] }>(this.apiUrl, {
        params: {
          q: terme,
          ...(département && { departement: département }),
          per_page: 25,
          page: 1,
          limite_matching_etablissements: 1,
          est_entrepreneur_individuel: false,
          mtm_campaign: 'mes-services-cyber',
        },
      });

      return réponse.data.results.flatMap((r) => extraisInfosEtablissement(terme, r) ?? []);
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

const extraisDépartement = (commune: string | null | undefined) => {
  if (!commune) {
    return null;
  }

  return commune.startsWith('97') || commune.startsWith('98') ? commune.slice(0, 3) : commune.slice(0, 2);
};

const extraisInfosEtablissement = (
  terme: string,
  resultat: RésultatSirene
): ResultatRechercheEntreprise | undefined => {
  let nom = resultat.nom_complet;
  const { departement, siret } = resultat.siege;
  let départementRetour = departement;
  let siretRetour = siret;

  const estUneRechercheParSiret = terme.match('^[0-9 ]+$');

  if (estUneRechercheParSiret) {
    const établissement = resultat.matching_etablissements?.[0];
    if (!établissement?.commune || !établissement.siret) return undefined;

    nom = établissement.liste_enseignes?.[0] ?? nom;
    départementRetour = extraisDépartement(établissement.commune);
    siretRetour = établissement.siret;
  }

  if (!départementRetour || !siretRetour) return undefined;

  const codeRégion = regions.find((region) => region.codeINSEE === resultat.siege.region)?.codeIso;

  return {
    nom,
    departement: départementRetour,
    siret: siretRetour,
    codeRegion: codeRégion,
    codeSecteur: resultat.section_activite_principale ?? undefined,
    codeTrancheEffectif: resultat.tranche_effectif_salarie ?? undefined,
    estAssociation: resultat.complements.est_association,
    estCollectivite: Boolean(resultat.complements.collectivite_territoriale),
    codeActivite: resultat.activite_principale,
  };
};

// https://recherche-entreprises.api.gouv.fr/docs/
type RésultatSirene = {
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
