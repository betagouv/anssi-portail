import axios from '@anssi-portail/axios';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fabriqueAdaptateurRechercheEntreprise } from '../../src/infra/adaptateurRechercheEntreprise.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';

describe('La recherche entreprise', () => {
  const resultatSirene = () => ({
    nom_complet: 'Organisation',
    siege: { departement: '92', siret: '18008001200248', region: '11' },
    matching_etablissements: [{ commune: '92026', siret: '18008001200248', liste_enseignes: [] }],
    complements: { est_association: false, collectivite_territoriale: null },
    activite_principale: '84.13Z',
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
    const adaptateur = fabriqueAdaptateurRechercheEntreprise(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('Inpi', null);

    assert.equal(resultats.length, 1);
    assert.equal(resultats[0].siret, '18008001200248');
    assert.equal(resultats[0].nom, 'Organisation');
  });

  it('conserve un établissement identifié même lorsque son siège est vide', async (t) => {
    t.mock.method(axios, 'get', async () => ({
      data: { results: [{ ...resultatSirene(), siege: {} }] },
    }));
    const adaptateur = fabriqueAdaptateurRechercheEntreprise(fauxAdaptateurEnvironnement);

    const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

    assert.equal(resultats.length, 1);
    assert.equal(resultats[0].siret, '18008001200248');
    assert.equal(resultats[0].departement, '92');
  });

  for (const etablissements of [undefined, []]) {
    it(`exclut un résultat sans établissement correspondant lors d'une recherche numérique (${String(etablissements)})`, async (t) => {
      t.mock.method(axios, 'get', async () => ({
        data: { results: [{ ...resultatSirene(), matching_etablissements: etablissements }] },
      }));
      const adaptateur = fabriqueAdaptateurRechercheEntreprise(fauxAdaptateurEnvironnement);

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
        const adaptateur = fabriqueAdaptateurRechercheEntreprise(fauxAdaptateurEnvironnement);

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
        const adaptateur = fabriqueAdaptateurRechercheEntreprise(fauxAdaptateurEnvironnement);

        const resultats = await adaptateur.rechercheOrganisations('18008001200248', null);

        assert.equal(resultats.length, 1);
        assert.equal(resultats[0].siret, '18008001200248');
        assert.equal(resultats[0].departement, '92');
      });
    }
  }
});
