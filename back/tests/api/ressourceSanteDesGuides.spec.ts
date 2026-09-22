import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { Guide } from '../../src/metier/guide.js';
import { ServiceSanteGuides } from '../../src/metier/serviceSanteGuides.js';
import { EntrepotGuideMemoire } from '../persistance/entrepotGuideMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { guideZeroTrust } from './objetsPretsALEmploi.js';

describe('La ressource Sante des guides', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let serviceSanteGuides: ServiceSanteGuides;
    let entrepotGuide: EntrepotGuideMemoire;

    beforeEach(() => {
      entrepotGuide = new EntrepotGuideMemoire();
      serviceSanteGuides = {
        calculeSante: async () => ({
          guidesAvecProbleme: [],
          guidesEnBonneSante: [],
        }),
      };
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        serviceSanteGuides,
        entrepotGuide,
      });
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/sante-guides');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('retourne le résulat du calcul de santé', async () => {
      const reponse = await request(serveur).get('/api/sante-guides');

      expect(reponse.body).toEqual({
        guidesAvecProbleme: [],
        guidesEnBonneSante: [],
      });
    });

    it('fournis les guides au service', async () => {
      let guidesUtilises: Guide[] = [];
      await entrepotGuide.ajoute(guideZeroTrust());
      serviceSanteGuides.calculeSante = async (guides: Guide[]) => {
        guidesUtilises = guides;
        return { guidesAvecProbleme: [], guidesEnBonneSante: [] };
      };

      await request(serveur).get('/api/sante-guides');

      expect(guidesUtilises).toBeDefined();
      expect(guidesUtilises).toHaveLength(1);
      expect(guidesUtilises[0].id).toBe('zero-trust');
    });
  });
});
