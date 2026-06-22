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
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { mesureDeTest } from './constructeurDeMesure';
import { utilisateurDeTest } from './constructeurDUtilisateur';

describe('La ressource d’un module', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepôtModule: EntrepôtModuleMémoire;
    let module: Module;
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepôtModule = new EntrepôtModuleMémoire();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        entrepotUtilisateur,
        entrepôtModule,
        adaptateurEnvironnement,
      });
      module = new Module(1, 'Cyberdépart');
      await entrepôtModule.ajoute(module);
      await entrepotUtilisateur.ajoute(jeanneDupont);
    });

    const getModuleCyberdépartConnecté = async () =>
      request(serveur).get('/api/modules/1').set('Cookie', cookieJeanneDupont);

    it('réponds 200', async () => {
      const reponse = await getModuleCyberdépartConnecté();

      assert.equal(reponse.status, 200);
    });

    it('réponds 401 si l’utilisateur n’est pas connecté', async () => {
      const reponse = await request(serveur).get('/api/modules/1');

      assert.equal(reponse.status, 401);
    });

    it('renvoie la liste des mesures', async () => {
      const mesure = mesureAuthentA2Etapes();
      module.mesures.push(mesure);
      await entrepotMesure.ajoute(mesure);

      const { body } = await getModuleCyberdépartConnecté();

      assert.equal(body.mesures.length, 1);
      assert.equal(body.mesures[0].id, 'AUTH.5');
    });

    it('trie les mesures par ordre', async () => {
      const mesureMes1 = mesureDeTest().avecLId('MES1').avecLOrdre(30).construis();
      module.mesures.push(mesureMes1);
      await entrepotMesure.ajoute(mesureMes1);

      const mesureMes2 = mesureDeTest().avecLId('MES2').avecLOrdre(10).construis();
      module.mesures.push(mesureMes2);
      await entrepotMesure.ajoute(mesureMes2);

      const { body } = await getModuleCyberdépartConnecté();

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
      module.mesures.push(mesureAuth5);
      await entrepotMesure.ajoute(mesureAuth5);

      const mesureMes1 = mesureDeTest().avecLId('MES1').avecLOrdre(15).construis();
      module.mesures.push(mesureMes1);
      await entrepotMesure.ajoute(mesureMes1);

      const unUtilisateurAvecUnePriseEnCompte = utilisateurDeTest().avecUneMesurePriseEnCompte(mesureAuth5).construis();
      const cookie = encodeSession({ email: unUtilisateurAvecUnePriseEnCompte.email, token: 'valide' });
      await entrepotUtilisateur.ajoute(unUtilisateurAvecUnePriseEnCompte);

      const { body } = await request(serveur).get('/api/modules/1').set('Cookie', cookie);

      assert.equal(body.mesures[0].estPriseEnCompte, true);
      assert.equal(body.mesures[1].estPriseEnCompte, false);
    });

    it('ne renvoie que les mesures du module demandé', async () => {
      const module4 = new Module(4, 'Perte de maîtrise de son entité');
      const mesure = mesureDeTest().construis();
      module4.mesures.push(mesure);
      await entrepôtModule.ajoute(module4);
      await entrepotMesure.ajoute(mesure);

      const { body } = await getModuleCyberdépartConnecté();

      assert.equal(body.mesures.length, 0);
    });

    it('réponds 404 si le module est inconnu', async () => {
      const reponse = await request(serveur).get('/api/modules/199').set('Cookie', cookieJeanneDupont);

      assert.equal(reponse.status, 404);
    });

    it('fournis la cible de déblocage du bagde cyberdépart', async () => {
      for (let i = 0; i < 5; i++) {
        const mesure = mesureDeTest().construis();
        await entrepotMesure.ajoute(mesure);
        module.mesures.push(mesure);
      }

      const { body } = await getModuleCyberdépartConnecté();

      assert.equal(body.cibleBadge, 4);
    });

    it('valide le type du paramètre de la requête', async () => {
      const reponse = await request(serveur).get('/api/modules/pas-un-nombre').set('Cookie', cookieJeanneDupont);

      assert.equal(reponse.status, 404);
    });
  });
});
