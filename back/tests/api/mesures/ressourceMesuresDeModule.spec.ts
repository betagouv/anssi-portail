import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { Module } from '../../../src/metier/module';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { jeanneDupont, mesureAuthentA2Etapes, moduleCyberdépart } from '../objetsPretsALEmploi';
import { mesureDeTest } from './constructeurDeMesure';
import { utilisateurDeTest } from './constructeurDUtilisateur';

describe('La ressource des mesures de sécurité d’un module', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepôtModule: EntrepôtModuleMémoire;
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepôtModule = new EntrepôtModuleMémoire();
      await entrepôtModule.ajoute(moduleCyberdépart);
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        entrepotUtilisateur,
        entrepôtModule,
        adaptateurEnvironnement,
      });
      await entrepotUtilisateur.ajoute(jeanneDupont);
    });

    const getMesuresCyberdépartConnecté = async () =>
      request(serveur).get('/api/modules/1').set('Cookie', cookieJeanneDupont);

    it('réponds 200', async () => {
      const reponse = await getMesuresCyberdépartConnecté();

      assert.equal(reponse.status, 200);
    });

    it('réponds 401 si l’utilisateur n’est pas connecté', async () => {
      const reponse = await request(serveur).get('/api/modules/1');

      assert.equal(reponse.status, 401);
    });

    it('renvoie la liste des mesures', async () => {
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const { body } = await getMesuresCyberdépartConnecté();

      assert.equal(body.mesures.length, 1);
      assert.equal(body.mesures[0].id, 'AUTH.5');
    });

    it('trie les mesures par ordre', async () => {
      await entrepotMesure.ajoute(
        mesureDeTest().avecLId('MES1').duModule(moduleCyberdépart).avecLOrdre(30).construis()
      );
      await entrepotMesure.ajoute(
        mesureDeTest().avecLId('MES2').duModule(moduleCyberdépart).avecLOrdre(10).construis()
      );

      const { body } = await getMesuresCyberdépartConnecté();

      assert.equal(body.mesures[0].id, 'MES2');
      assert.equal(body.mesures[1].id, 'MES1');
    });

    it('réponds 404 si la fonctionnalité est désactivée', async () => {
      const adaptateurEnvironnement: AdaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
        fonctionnalites: () => ({
          ...fauxAdaptateurEnvironnement.fonctionnalites(),
          parcoursDeSecurisation: () => ({
            estActif: () => false,
          }),
        }),
      };

      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const serveurSansLaRessource = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
      const reponse = await request(serveurSansLaRessource).get('/api/modules/1');

      assert.equal(reponse.status, 404);
    });

    it('indique si les mesures ont été prises en compte', async () => {
      const mesureAuth5 = mesureAuthentA2Etapes();
      const unUtilisateurAvecUnePriseEnCompte = utilisateurDeTest().avecUneMesurePriseEnCompte(mesureAuth5).construis();

      const cookie = encodeSession({ email: unUtilisateurAvecUnePriseEnCompte.email, token: 'valide' });
      await entrepotUtilisateur.ajoute(unUtilisateurAvecUnePriseEnCompte);
      await entrepotMesure.ajoute(mesureAuth5);
      await entrepotMesure.ajoute(
        mesureDeTest().avecLId('MES1').avecLOrdre(15).duModule(moduleCyberdépart).construis()
      );

      const { body } = await request(serveur).get('/api/modules/1').set('Cookie', cookie);

      assert.equal(body.mesures[0].estPriseEnCompte, true);
      assert.equal(body.mesures[1].estPriseEnCompte, false);
    });

    it('ne renvoie que les mesures du module demandé', async () => {
      const module = new Module(4, 'Perte de maîtrise de son entité');
      await entrepôtModule.ajoute(module);
      await entrepotMesure.ajoute(mesureDeTest().duModule(module).construis());

      const { body } = await getMesuresCyberdépartConnecté();

      assert.equal(body.mesures.length, 0);
    });

    it('réponds 404 si le module est inconnu', async () => {
      const reponse = await request(serveur).get('/api/modules/199').set('Cookie', cookieJeanneDupont);

      assert.equal(reponse.status, 404);
    });
  });
});
