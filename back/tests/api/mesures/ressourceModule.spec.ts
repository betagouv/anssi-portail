import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Mesure } from '../../../src/metier/mesure.js';
import { Module } from '../../../src/metier/module.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { fabriqueModuleCyberdépart, jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';
import { ConstructeurDeModule } from './constructeurDeModule.js';
import { mesureDeTest } from './constructeurDeMesure.js';
import { utilisateurDeTest } from './constructeurDUtilisateur.js';

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
      module = fabriqueModuleCyberdépart();
      await entrepôtModule.ajoute(module);
      await entrepotUtilisateur.ajoute(jeanneDupont);
    });

    async function ajouteMesure(module: Module, mesure: Mesure) {
      module.mesures.push(mesure);
      await entrepotMesure.ajoute(mesure);
    }

    const getModuleCyberdépartConnecté = async () =>
      request(serveur).get('/api/modules/1').set('Cookie', cookieJeanneDupont);

    it('réponds 200', async () => {
      const reponse = await getModuleCyberdépartConnecté();

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('réponds 401 si l’utilisateur n’est pas connecté', async () => {
      const reponse = await request(serveur).get('/api/modules/1');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('renvoie la liste des mesures', async () => {
      await ajouteMesure(module, mesureAuthentA2Etapes());

      const { body } = await getModuleCyberdépartConnecté();

      expect(body.mesures).toHaveLength(1);
      expect(body.mesures[0].id).toBe('AUTH.5');
    });

    it('trie les mesures par ordre', async () => {
      await ajouteMesure(module, mesureDeTest().avecLId('MES1').avecLOrdre(30).construis());
      await ajouteMesure(module, mesureDeTest().avecLId('MES2').avecLOrdre(10).construis());

      const { body } = await getModuleCyberdépartConnecté();

      expect(body.mesures[0].id).toBe('MES2');
      expect(body.mesures[1].id).toBe('MES1');
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

      await ajouteMesure(module, mesureAuthentA2Etapes());

      const serveurSansLaRessource = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
      const reponse = await request(serveurSansLaRessource).get('/api/modules/1');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('indique si les mesures ont été prises en compte', async () => {
      const mesureAuth5 = mesureAuthentA2Etapes();
      await ajouteMesure(module, mesureAuth5);
      await ajouteMesure(module, mesureDeTest().avecLId('MES1').avecLOrdre(15).construis());

      const unUtilisateurAvecUnePriseEnCompte = utilisateurDeTest().avecUneMesurePriseEnCompte(mesureAuth5).construis();
      const cookie = encodeSession({ email: unUtilisateurAvecUnePriseEnCompte.email, token: 'valide' });
      await entrepotUtilisateur.ajoute(unUtilisateurAvecUnePriseEnCompte);

      const { body } = await request(serveur).get('/api/modules/1').set('Cookie', cookie);

      expect(body.mesures[0].estPriseEnCompte).toBe(true);
      expect(body.mesures[1].estPriseEnCompte).toBe(false);
    });

    it('ne renvoie que les mesures du module demandé', async () => {
      await ajouteMesure(
        new ConstructeurDeModule().avecLId(4).avecLeNom('Perte de maîtrise de son entité').construis(),
        mesureDeTest().construis()
      );

      const { body } = await getModuleCyberdépartConnecté();

      expect(body.mesures).toHaveLength(0);
    });

    it('réponds 404 si le module est inconnu', async () => {
      const reponse = await request(serveur).get('/api/modules/199').set('Cookie', cookieJeanneDupont);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('fournis la cible de déblocage du bagde cyberdépart', async () => {
      for (let i = 0; i < 5; i++) {
        await ajouteMesure(module, mesureDeTest().construis());
      }

      const { body } = await getModuleCyberdépartConnecté();

      expect(body.cibleBadge).toBe(2);
    });

    it('valide le type du paramètre de la requête', async () => {
      const reponse = await request(serveur).get('/api/modules/pas-un-nombre').set('Cookie', cookieJeanneDupont);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('renvoie le nom du module', async () => {
      await entrepôtModule.ajoute(
        new ConstructeurDeModule().avecLId(2).avecLeNom('Module 2').avecLaDescription('Description 2').construis()
      );

      const reponse = await request(serveur).get('/api/modules/2').set('Cookie', cookieJeanneDupont);

      expect(reponse.body.nom).toBe('Module 2');
      expect(reponse.body.description).toBe('Description 2');
    });
  });
});
