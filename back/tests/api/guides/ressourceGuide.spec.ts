import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { guideZeroTrust } from '../objetsPretsALEmploi.js';

describe('La ressource guide', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;
  let busEvenements: MockBusEvenement;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    busEvenements = new MockBusEvenement();
    await entrepotGuide.ajoute(guideZeroTrust());
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotGuide,
    });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie les détails du guide', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      const guide = reponse.body;
      expect(guide.id).toBe('zero-trust');
      expect(guide.nom).toBe('Zero Trust');
      expect(guide.description).toBe(
        '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>'
      );
      expect(guide.image).toEqual({
        petite: '/documents-guides/zero-trust/588.avif',
        grande: '/documents-guides/zero-trust/origine.avif',
      });
      expect(guide.langue).toBe('FR');
      expect(guide.thematique).toBe('Les essentiels');
      expect(guide.collections).toEqual(['Les essentiels']);
      expect(guide.lienCourt).toBe('https://cyber.gouv.fr/fondamentaux-zero-trust');
    });

    it("répond 404 si le guide n'existe pas", async () => {
      const reponse = await request(serveur).get('/api/guides/slug-de-guide-inconnu');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotGuide.parId = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      expect(reponse.status).toBe(HttpStatusCode.InternalServerError);
    });

    it('renvoie les documents du guide', async () => {
      const reponse = await request(serveur).get('/api/guides/zero-trust');

      expect(reponse.body.documents).toEqual([
        {
          libelle: 'Les Fondamentaux de l&#039;ANSSI - Zero Trust - v1.0',
          url: 'http://localhost/documents-guides/anssi-fondamentaux-zero-trust-v1.0.pdf',
        },
      ]);
    });
  });
});
