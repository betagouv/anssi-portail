import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { Guide } from '../../../src/metier/guide';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideDevsecops, guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource qui gère les guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    await entrepotGuide.ajoute(guideZeroTrust);
    await entrepotGuide.ajoute(guideDevsecops);
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.status, 200);
    });

    it('renvoie la liste des guides', async () => {
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.body.length, 2);
      const premierGuide = reponse.body[0];
      assert.equal(premierGuide.id, 'zero-trust');
      assert.equal(premierGuide.nom, 'Zero Trust');
      assert.equal(
        premierGuide.description,
        '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>'
      );
      assert.deepEqual(premierGuide.image, {
        petite:
          'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-588.avif',
        grande:
          'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-origine.avif',
      });
      assert.equal(premierGuide.langue, 'FR');
      assert.equal(premierGuide.thematique, 'Les essentiels');
      assert.deepEqual(premierGuide.collections, ['Les essentiels']);
      assert.deepEqual(premierGuide.besoins, ['REAGIR', 'SE_FORMER']);

      const secondGuide = reponse.body[1];
      assert.equal(secondGuide.id, 'devsecops');
      assert.equal(secondGuide.nom, 'DevSecOps');
      assert.equal(
        secondGuide.description,
        '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>'
      );
      assert.deepEqual(secondGuide.image, {
        petite:
          'https://notre-cellar/guides/devsecops/anssi_essentiels_devsecops_v1-588.avif',
        grande:
          'https://notre-cellar/guides/devsecops/anssi_essentiels_devsecops_v1-origine.avif',
      });
      assert.equal(secondGuide.langue, 'FR');
      assert.equal(secondGuide.thematique, 'Les essentiels');
      assert.deepEqual(secondGuide.collections, ['Les essentiels']);
      assert.deepEqual(secondGuide.besoins, ['SECURISER']);
    });

    it("expose les dates d'un guide", async () => {
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.body[0].datePublication, '20 Juin 2025');
      assert.equal(reponse.body[0].dateMiseAJour, '20 Juin 2025');
    });

    it("gère l'absence d'image sur un guide", async () => {
      await entrepotGuide.vide();
      await entrepotGuide.ajoute(
        new Guide({ ...guideZeroTrust, nomImage: null })
      );

      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.body[0].image, null);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotGuide.tous = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/guides');

      assert.equal(reponse.status, 500);
    });
  });
});
