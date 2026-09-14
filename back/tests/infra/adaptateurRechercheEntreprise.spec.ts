import axios from '@anssi-portail/axios';
import { describe, it, vi, expect } from 'vitest';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { AdaptateurRechercheEntrepriseGouv } from '../../src/infra/adaptateurRechercheEntrepriseGouv.js';

describe('La recherche entreprise', () => {
  const resultatSirene = () => ({
    nom_complet: 'Organisation',
    siege: { departement: '92', siret: '18008001200248', region: '11' },
    matching_etablissements: [{ commune: '92026', siret: '18008001200248', liste_enseignes: [] }],
    complements: { est_association: false, collectivite_territoriale: null },
    activite_principale: '84.13Z',
  });

  describe('avec cache', () => {
    it('retourne le résultat de la recherche entreprise', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const resultats = await adaptateur.rechercheOrganisations('Organisation', '92');

      expect(resultats).toEqual([
        {
          nom: 'Organisation',
          departement: '92',
          siret: '18008001200248',
          codeRegion: 'FR-IDF',
          codeSecteur: undefined,
          codeTrancheEffectif: undefined,
          estAssociation: false,
          estCollectivite: false,
          codeActivite: '84.13Z',
        },
      ]);
    });

    it('ne rappelle pas la recherche entreprise deux fois', async () => {
      const get = vi.spyOn(axios, 'get').mockImplementation(async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const premierResultat = await adaptateur.rechercheOrganisations('Organisation', '92');
      const secondResultat = await adaptateur.rechercheOrganisations('Organisation', '92');

      expect(secondResultat).toEqual(premierResultat);
      expect(get.mock.calls).toHaveLength(1);
    });

    it('distingue les éléments à mettre en cache par terme et département', async () => {
      const get = vi.spyOn(axios, 'get').mockImplementation(async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);
      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);

      expect(get.mock.calls).toHaveLength(3);
    });
  });

  it('exclut les dossiers INPI sans siège et conserve les organisations identifiées', async () => {
    vi.spyOn(axios, 'get').mockImplementation(async () => ({
      data: {
        results: [
          { ...resultatSirene(), nom_complet: 'Dossier INPI 1', siege: {}, matching_etablissements: [] },
          resultatSirene(),
          { ...resultatSirene(), nom_complet: 'Dossier INPI 2', siege: {}, matching_etablissements: [] },
        ],
      },
    }));
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('Inpi', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].siret).toBe('18008001200248');
    expect(resultats[0].nom).toBe('Organisation');
  });

  it('conserve un établissement identifié même lorsque son siège est vide', async () => {
    vi.spyOn(axios, 'get').mockImplementation(async () => ({
      data: { results: [{ ...resultatSirene(), siege: {} }] },
    }));
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].siret).toBe('18008001200248');
    expect(resultats[0].departement).toBe('92');
  });

  it.each([
    ['97105', '971'],
    ['98735', '987'],
    ['2A004', '2A'],
  ])(`extrait le département $1 de la commune $0`, async (commune, departement) => {
    const resultat = resultatSirene();
    vi.spyOn(axios, 'get').mockImplementation(async () => ({
      data: {
        results: [{ ...resultat, matching_etablissements: [{ ...resultat.matching_etablissements[0], commune }] }],
      },
    }));
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    expect(resultats).toHaveLength(1);
    expect(resultats[0].departement).toBe(departement);
  });

  it.each([undefined, []].map((etablissements) => ({ etablissements })))(
    "exclut un résultat sans établissement correspondant lors d'une recherche numérique ($etablissements)",
    async ({ etablissements }) => {
      vi.spyOn(axios, 'get').mockImplementation(async () => ({
        data: { results: [{ ...resultatSirene(), matching_etablissements: etablissements }] },
      }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      expect(await adaptateur.rechercheOrganisations('18008001200248', null)).toEqual([]);
    }
  );

  it.each([undefined, null, ''].flatMap((valeur) => ['departement', 'siret'].map((champ) => ({ valeur, champ }))))(
    `exclut un siège avec $champ à $valeur`,
    async ({ valeur, champ }) => {
      const resultat = resultatSirene();
      vi.spyOn(axios, 'get').mockImplementation(async () => ({
        data: { results: [{ ...resultat, siege: { ...resultat.siege, [champ]: valeur } }] },
      }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      expect(await adaptateur.rechercheOrganisations('Inpi', null)).toEqual([]);
    }
  );

  it.each([undefined, null, ''].flatMap((valeur) => ['commune', 'siret'].map((champ) => ({ valeur, champ }))))(
    `exclut un établissement avec $champ à $valeur lors d'une recherche numérique`,
    async ({ valeur, champ }) => {
      const resultat = resultatSirene();
      vi.spyOn(axios, 'get').mockImplementation(async () => ({
        data: {
          results: [
            {
              ...resultat,
              matching_etablissements: [{ ...resultat.matching_etablissements[0], [champ]: valeur }],
            },
            resultat,
          ],
        },
      }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

      expect(resultats).toHaveLength(1);
      expect(resultats[0].siret).toBe('18008001200248');
      expect(resultats[0].departement).toBe('92');
    }
  );
});
