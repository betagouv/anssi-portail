import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource guide', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    await entrepotGuide.ajoute(guideZeroTrust);
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les détails du guide', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      assert.deepEqual(reponse.body, {
        id: 'zero-trust',
        nom: 'Zero Trust',
        resume:
          'Le modèle Zero Trust fait l’objet d’un engouement croissant en promettant un accès sécurisé aux ressources informatiques dans les contextes d&#039;usages mixtes. Néanmoins, son déploiement doit être intégré dans une logique de défense en profondeur et respecter nombre de prérequis techniques et opérationnels pour assurer l’efficacité des mécanismes de contrôle d’accès.',
        description:
          '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>',
        image: {
          petite:
            'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-234.avif',
          grande:
            'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-588.avif',
        },
        langue: 'FR',
        collections: ['Les essentiels'],
      });
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur).get(
        '/api/guides/slug-de-guide-inconnu'
      );

      assert.equal(reponse.status, 404);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotGuide.parId = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      assert.equal(reponse.status, 500);
    });
  });
});
