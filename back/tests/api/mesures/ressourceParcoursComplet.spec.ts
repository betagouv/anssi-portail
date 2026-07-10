import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { Module } from '../../../src/metier/module.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { mesureDeTest } from './constructeurDeMesure.js';

describe('La ressource du parcours complet', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let cookieDeJeanneDupont: string;
    let entrepôtModule: EntrepôtModuleMémoire;

    beforeEach(() => {
      entrepôtModule = new EntrepôtModuleMémoire();
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtModule });

      cookieDeJeanneDupont = encodeSession({
        email: jeanneDupont.email,
        token: 'valide',
      });
    });

    it('retourne 200', async () => {
      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.status, 200);
    });

    it('retourne 404 si la fonctionnalité est désactivée', async () => {
      const adaptateurEnvironnement: AdaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
        fonctionnalites: () => ({
          ...fauxAdaptateurEnvironnement.fonctionnalites(),
          parcoursDeSecurisation: () => ({
            estActif: () => false,
          }),
        }),
      };
      const configuration = {
        ...configurationDeTestDuServeur,
        adaptateurEnvironnement,
      };
      const serveurSansLaRessource = creeServeur(configuration);

      const reponse = await request(serveurSansLaRessource).get('/api/parcours/complet');

      assert.equal(reponse.status, 404);
    });

    it("retourne 401 si l'utilisateur n'est pas connecté", async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/parcours/complet');

      assert.equal(reponse.status, 401);
    });

    it('retourne les modules du parcours complet', async () => {
      await entrepôtModule.ajoute(new Module(1, 'Cyberdépart'));
      await entrepôtModule.ajoute(new Module(2, 'Aggravation des conséquences'));

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.body.modules.length, 2);
      assert.equal(reponse.body.modules[0].nom, 'Cyberdépart');
      assert.equal(reponse.body.modules[0].id, 1);
      assert.equal(reponse.body.modules[1].nom, 'Aggravation des conséquences');
      assert.equal(reponse.body.modules[1].id, 2);
    });

    it('retourne le nombre de mesures de chaque module', async () => {
      const module = new Module(1, 'Cyberdépart');
      module.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];
      await entrepôtModule.ajoute(module);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.body.modules[0].nombreMesuresTotal, 2);
    });
  });
});
