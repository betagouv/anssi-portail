import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { guideDevsecops, guideZeroTrust } from '../objetsPretsALEmploi';

describe('La ressource guide', () => {
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
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les détails du guide', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      const guide = reponse.body;
      assert.equal(guide.id, 'zero-trust');
      assert.equal(guide.nom, 'Zero Trust');
      assert.equal(
        guide.resume,
        'Le modèle Zero Trust fait l’objet d’un engouement croissant en promettant un accès sécurisé aux ressources informatiques dans les contextes d&#039;usages mixtes. Néanmoins, son déploiement doit être intégré dans une logique de défense en profondeur et respecter nombre de prérequis techniques et opérationnels pour assurer l’efficacité des mécanismes de contrôle d’accès.'
      );
      assert.equal(
        guide.description,
        '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>'
      );
      assert.deepEqual(guide.image, {
        petite:
          'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-234.avif',
        grande:
          'https://notre-cellar/guides/zero-trust/anssi-fondamentaux-zero-trust-v1_publication-588.avif',
      });
      assert.equal(guide.langue, 'FR');
      assert.deepEqual(guide.collections, ['Les essentiels']);
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

    it('renvoie les document du guide', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      assert.deepEqual(reponse.body.documents, [
        {
          libelle: 'Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0',
          url: 'https://notre-cellar/guides/anssi-fondamentaux-zero-trust-v1.0.pdf',
        },
      ]);
    });
  });

  describe('sur demande des guides de même collection', () => {
    beforeEach(() => {
      entrepotGuide.ajoute({
        id: 'guide-sans-collection',
        nom: 'Guide sans collection',
        resume: '',
        description: '',
        nomImage: '',
        langue: 'FR',
        collections: [],
        documents: [],
        dateMiseAJour: '',
        datePublication: '',
      });
    });
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/api/guides/zero-trust/memes-collections'
      );

      assert.equal(reponse.status, 200);
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur).get(
        '/api/guides/slug-de-guide-inconnu/memes-collections'
      );

      assert.equal(reponse.status, 404);
    });

    it('renvoie une liste de guides dont les collections correspondent à au moins une collection du guide ciblé', async () => {
      const reponse = await request(serveur).get(
        '/api/guides/zero-trust/memes-collections'
      );

      assert.equal(reponse.body.length, 2);
      assert.equal(reponse.body[0].id, 'zero-trust');
      assert.equal(reponse.body[1].id, 'devsecops');
    });

    it("renvoie une liste vide si le guide ciblé n'a pas de collection", async () => {
      const reponse = await request(serveur).get(
        '/api/guides/guide-sans-collection/memes-collections'
      );

      assert.equal(reponse.body.length, 0);
    });
  });
});
