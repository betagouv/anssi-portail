import axios, { AxiosError } from '@anssi-portail/axios';
import { regions } from '../metier/referentielRegions.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { RechercheEntrepriseAvecCache } from './RechercheEntrepriseAvecCache.js';

export interface AdaptateurRechercheEntreprise {
  rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]>;
}

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

const creerRechercheSansCache = (apiUrl: string): AdaptateurRechercheEntreprise => ({
  async rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]> {
    try {
      const reponse = await axios.get<{ results: ResultatSirene[] }>(apiUrl, {
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
  },
});

const rechercheFactice: AdaptateurRechercheEntreprise = {
  async rechercheOrganisations(terme: string, departement: string | null): Promise<ResultatRechercheEntreprise[]> {
    return [
      {
        nom: `Entreprise Factice - ${terme}`,
        departement: departement || '75',
        siret: '12345678901237',
        codeTrancheEffectif: '12',
        codeSecteur: '6201Z',
        codeRegion: '11',
        estCollectivite: false,
        estAssociation: false,
        codeActivite: '6202A',
      },
      {
        nom: `Autre Entreprise Factice - ${terme}`,
        departement: departement || '69',
        siret: '98765432109876',
        codeTrancheEffectif: '22',
        codeSecteur: '6202A',
        codeRegion: '84',
        estCollectivite: false,
        estAssociation: false,
        codeActivite: '6202A',
      },
    ];
  },
};

export const fabriqueAdaptateurRechercheEntreprise = (adaptateurEnvironnement: AdaptateurEnvironnement) => {
  const apiUrl = adaptateurEnvironnement.rechercheEntreprise().apiUrl();
  const adaptateur = apiUrl ? creerRechercheSansCache(apiUrl) : rechercheFactice;
  return new RechercheEntrepriseAvecCache(adaptateur);
};
