import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { Guide } from '../../src/metier/guide';
import { ServiceSanteGuides } from '../../src/metier/serviceSanteGuides';
import { EntrepotGuideMemoire } from '../persistance/entrepotGuideMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';
import { guideZeroTrust } from './objetsPretsALEmploi';

describe('La ressource Sante des guides', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let serviceSanteGuides: ServiceSanteGuides;
    let entrepotGuide: EntrepotGuideMemoire;

    beforeEach(() => {
      entrepotGuide = new EntrepotGuideMemoire();
      serviceSanteGuides = {
        calculeSante: () => ({
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

      assert.equal(reponse.status, 200);
    });

    it('retourne le résulat du calcul de santé', async () => {
      const reponse = await request(serveur).get('/api/sante-guides');

      assert.deepEqual(reponse.body, {
        guidesAvecProbleme: [],
        guidesEnBonneSante: [],
      });
    });

    it('fournis les guides au service', async () => {
      let guidesUtilises: Guide[] = [];
      await entrepotGuide.ajoute(guideZeroTrust());
      serviceSanteGuides.calculeSante = (guides: Guide[]) => {
        guidesUtilises = guides;
        return { guidesAvecProbleme: [], guidesEnBonneSante: [] };
      };

      await request(serveur).get('/api/sante-guides');

      assert.notEqual(guidesUtilises, undefined);
      assert.equal(guidesUtilises.length, 1);
      assert.equal(guidesUtilises[0].id, 'zero-trust');
    });
  });
});
