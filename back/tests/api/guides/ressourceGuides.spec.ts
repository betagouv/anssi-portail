import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { EntrepotGuideMemoire } from '../../persistance/entrepotGuideMemoire.js';
import { EntrepotGuideTravailMemoire } from '../../persistance/entrepotGuideTravailMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { guideDevsecops, guidePublieDemain, guideZeroTrust } from '../objetsPretsALEmploi.js';

describe('La ressource qui gère les guides', () => {
  let serveur: Express;
  let entrepotGuide: EntrepotGuideMemoire;
  let entrepotGuideTravail: EntrepotGuideTravailMemoire;

  beforeEach(async () => {
    entrepotGuide = new EntrepotGuideMemoire();
    entrepotGuideTravail = new EntrepotGuideTravailMemoire();
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepotGuide, entrepotGuideTravail });
  });

  describe('sur requête GET', () => {
    describe("lorsqu'il y a 2 guides", () => {
      beforeEach(async () => {
        await entrepotGuide.ajoute(guideZeroTrust());
        await entrepotGuide.ajoute(guideDevsecops());
      });
      it('répond 200', async () => {
        const reponse = await request(serveur).get('/api/guides');

        expect(reponse.status).toBe(HttpStatusCode.Ok);
      });

      it('renvoie la liste des guides', async () => {
        const reponse = await request(serveur).get('/api/guides');

        expect(reponse.body).toHaveLength(2);
        const premierGuide = reponse.body[0];
        expect(premierGuide.id).toBe('zero-trust');
        expect(premierGuide.nom).toBe('Zero Trust');
        expect(premierGuide.description).toBe(
          '<p>Avec l’accroissement des usages liés au télétravail, à la pratique du « Bring Your Own Device » (BYOD) et aux accès hétérogènes à des services on-premise ou dans le cloud, les produits dérivés du modèle Zero Trust sont promus par les éditeurs.</p><p> Les produits dits Zero Trust sont vus comme des solutions permettant de pallier certaines limitations des mesures traditionnelles telles que la protection des flux par VPN ou le filtrage réseau par des pares-feux périmétriques. Bien souvent, les modèles Zero Trust et de défense périmétrique sont opposés alors qu’ils sont complémentaires et partagent de nombreux principes communs. Ainsi le modèle Zero Trust doit être inclus dans une stratégie de défense en profondeur et il ne doit en aucun cas être vu comme un remplacement d’une défense périmétrique.</p><p> Le principal objectif de ce modèle est de réduire la confiance implicite accordée à un sujet souhaitant accéder au système d’information (SI). Il apporter un éclairage complémentaire à l’avis scientifique et technique de l’ANSSI publié en 2021 sur le modèle Zero Trust et sur la manière dont il peut être mis en œuvre progressivement dans le cadre d’une stratégie de défense en profondeur.</p>'
        );
        expect(premierGuide.image).toEqual({
          petite: '/documents-guides/zero-trust/588.avif',
          grande: '/documents-guides/zero-trust/origine.avif',
        });
        expect(premierGuide.langue).toBe('FR');
        expect(premierGuide.thematique).toBe('Les essentiels');
        expect(premierGuide.collections).toEqual(['Les essentiels']);
        expect(premierGuide.besoins).toEqual(['REAGIR', 'SE_FORMER']);

        const secondGuide = reponse.body[1];
        expect(secondGuide.id).toBe('devsecops');
        expect(secondGuide.nom).toBe('DevSecOps');
        expect(secondGuide.description).toBe(
          '<p>Les Essentiels de l’ANSSI visent à éclairer l’ensemble de nos lecteurs, quel que soit leur niveau de connaissance technique, sur les grands enjeux de la cybersécurité. Ils reflètent le point de vue de l’agence au moment de leur publication et ne se positionnent pas comme des documents de recommandations détaillées, comme nos guides. Il s’agit plutôt de l’énonciation de bonnes pratiques indépendantes pouvant être mises en place de façon complémentaire. Ces recommandations sont susceptibles d’être mises à jour régulièrement suivant l’évolution de la menace, des technologies utilisées, de nos retours d’expérience, etc.</p>'
        );
        expect(secondGuide.image).toEqual({
          petite: '/documents-guides/devsecops/588.avif',
          grande: '/documents-guides/devsecops/origine.avif',
        });
        expect(secondGuide.langue).toBe('FR');
        expect(secondGuide.thematique).toBe('Les essentiels');
        expect(secondGuide.collections).toEqual(['Les essentiels']);
        expect(secondGuide.besoins).toEqual(['SECURISER']);
      });

      it("expose les dates d'un guide", async () => {
        const reponse = await request(serveur).get('/api/guides');

        expect(reponse.body[0].dateMiseAJour).toBe(new Date(2025, 5, 20).toISOString());
      });

      it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
        entrepotGuide.tous = () => {
          throw new Error('Erreur technique');
        };
        const reponse = await request(serveur).get('/api/guides');

        expect(reponse.status).toBe(HttpStatusCode.InternalServerError);
      });
    });

    describe("lorsqu'il n'y a pas de guide", () => {
      it('ne retourne pas les guides non publiés', async () => {
        await entrepotGuide.ajoute(guidePublieDemain());

        const reponse = await request(serveur).get('/api/guides');

        expect(reponse.body).toHaveLength(0);
      });
    });

    describe('lorsqu’on demande des guides en mode travail', () => {
      it('récupère les guides depuis l’entrepôt de travail', async () => {
        await entrepotGuideTravail.ajoute(guideZeroTrust());

        const reponse = await request(serveur).get('/api/guides?mode=travail');

        expect(reponse.body).toHaveLength(1);
        expect(reponse.body[0].id).toBe('zero-trust');
      });
    });
  });
});
