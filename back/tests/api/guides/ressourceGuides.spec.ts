import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { EntrepotGuide } from '../../../src/metier/entrepotGuide';
import { guideDevsecops, guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource qui gère les guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuide;

  beforeEach(() => {
    entrepotGuide = {
      tous: async () => [guideZeroTrust, guideDevsecops],
    };
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
      assert.deepEqual(reponse.body[0], {
        id: 'zero-trust',
        nom: 'Zero Trust',
        resume:
          'Le modèle Zero Trust fait l’objet d’un engouement croissant en promettant un accès sécurisé aux ressources informatiques dans les contextes d&#039;usages mixtes. Néanmoins, son déploiement doit être intégré dans une logique de défense en profondeur et respecter nombre de prérequis techniques et opérationnels pour assurer l’efficacité des mécanismes de contrôle d’accès.',
        description:
          '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>',
        illustration:
          'https://cyber.gouv.fr/sites/default/files/image/anssi-fondamentaux-zero-trust-v1_publication.jpg',
        langue: 'FR',
        collections: ['Les essentiels'],
      });
      assert.deepEqual(reponse.body[1], {
        id: 'devsecops',
        nom: 'DevSecOps',
        resume:
          'Le DevSecOps est une méthodologie qui vise à inclure les pratiques de sécurité dans le processus de développement et de mise en production d&#039;applications. Certaines bonnes pratiques de sécurité sont donc à considérer.',
        description:
          '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>',
        illustration:
          'https://cyber.gouv.fr/sites/default/files/image/anssi_essentiels_devsecops_v1.jpg',
        langue: 'FR',
        collections: ['Les essentiels'],
      });
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
