import axios from '@anssi-portail/axios';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
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
    it('retourne le résultat de la recherche entreprise', async (t) => {
      t.mock.method(axios, 'get', async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const resultats = await adaptateur.rechercheOrganisations('Organisation', '92');

      assert.deepEqual(resultats, [
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

    it('ne rappelle pas la recherche entreprise deux fois', async (t) => {
      const get = t.mock.method(axios, 'get', async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const premierResultat = await adaptateur.rechercheOrganisations('Organisation', '92');
      const secondResultat = await adaptateur.rechercheOrganisations('Organisation', '92');

      assert.deepEqual(secondResultat, premierResultat);
      assert.equal(get.mock.callCount(), 1);
    });

    it('distingue les éléments à mettre en cache par terme et département', async (t) => {
      const get = t.mock.method(axios, 'get', async () => ({ data: { results: [resultatSirene()] } }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);
      await adaptateur.rechercheOrganisations('Organisation', '92');
      await adaptateur.rechercheOrganisations('Autre organisation', '92');
      await adaptateur.rechercheOrganisations('Organisation', null);

      assert.equal(get.mock.callCount(), 3);
    });
  });

  it('exclut les dossiers INPI sans siège et conserve les organisations identifiées', async (t) => {
    t.mock.method(axios, 'get', async () => ({
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

    assert.equal(resultats.length, 1);
    assert.equal(resultats[0].siret, '18008001200248');
    assert.equal(resultats[0].nom, 'Organisation');
  });

  it('conserve un établissement identifié même lorsque son siège est vide', async (t) => {
    t.mock.method(axios, 'get', async () => ({
      data: { results: [{ ...resultatSirene(), siege: {} }] },
    }));
    const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    assert.equal(resultats.length, 1);
    assert.equal(resultats[0].siret, '18008001200248');
    assert.equal(resultats[0].departement, '92');
  });

  for (const [commune, departement] of [
    ['97105', '971'],
    ['98735', '987'],
    ['2A004', '2A'],
  ]) {
    it(`extrait le département ${departement} de la commune ${commune}`, async (t) => {
      const resultat = resultatSirene();
      t.mock.method(axios, 'get', async () => ({
        data: {
          results: [{ ...resultat, matching_etablissements: [{ ...resultat.matching_etablissements[0], commune }] }],
        },
      }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

      assert.equal(resultats.length, 1);
      assert.equal(resultats[0].departement, departement);
    });
  }

  for (const etablissements of [undefined, []]) {
    it(`exclut un résultat sans établissement correspondant lors d'une recherche numérique (${String(etablissements)})`, async (t) => {
      t.mock.method(axios, 'get', async () => ({
        data: { results: [{ ...resultatSirene(), matching_etablissements: etablissements }] },
      }));
      const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

      assert.deepEqual(await adaptateur.rechercheOrganisations('18008001200248', null), []);
    });
  }

  for (const valeur of [undefined, null, '']) {
    for (const champ of ['departement', 'siret']) {
      it(`exclut un siège avec ${champ} à ${String(valeur)}`, async (t) => {
        const resultat = resultatSirene();
        t.mock.method(axios, 'get', async () => ({
          data: { results: [{ ...resultat, siege: { ...resultat.siege, [champ]: valeur } }] },
        }));
        const adaptateur = new AdaptateurRechercheEntrepriseGouv(fauxAdaptateurEnvironnement);

        assert.deepEqual(await adaptateur.rechercheOrganisations('Inpi', null), []);
      });
    }

    for (const champ of ['commune', 'siret']) {
      it(`exclut un établissement avec ${champ} à ${String(valeur)} lors d'une recherche numérique`, async (t) => {
        const resultat = resultatSirene();
        t.mock.method(axios, 'get', async () => ({
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

        assert.equal(resultats.length, 1);
        assert.equal(resultats[0].siret, '18008001200248');
        assert.equal(resultats[0].departement, '92');
      });
    }
  }
});
