import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { Module } from '../../../src/metier/module.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from '../cookie.js';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
  fauxAdaptateurHachage,
  fauxAdaptateurRechercheEntreprise,
} from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { mesureDeTest } from './constructeurDeMesure.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';

describe('La ressource du parcours complet', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let cookieDeJeanneDupont: string;
    let entrepôtModule: EntrepôtModuleMémoire;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let jeannetteDupont: Utilisateur;

    beforeEach(async () => {
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepôtModule = new EntrepôtModuleMémoire();
      serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtModule, entrepotUtilisateur });
      jeannetteDupont = new Utilisateur(
        {
          ...jeanneDupont,
        },
        fauxAdaptateurRechercheEntreprise,
        fauxAdaptateurHachage
      );
      await entrepotUtilisateur.ajoute(jeannetteDupont);
      cookieDeJeanneDupont = encodeSession({
        email: jeannetteDupont.email,
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

    it('retourne la cible de déblocage du badge Cyberdépart', async () => {
      const module = new Module(1, 'Cyberdépart');
      module.mesures = [
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
      ];
      await entrepôtModule.ajoute(module);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.body.modules[0].cibleBadge, 4);
    });

    it("retourne le nombre de mesures prises en compte par l'utilisateur pour chaque module", async () => {
      await entrepôtModule.ajoute(new Module(1, 'Cyberdépart'));
      await entrepôtModule.ajoute(new Module(2, 'Aggravation des conséquences'));
      jeannetteDupont.nombreDeMesuresPrisesEnCompte = async (module: Module) => (module.id === 1 ? 98 : 20);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      assert.equal(reponse.body.modules[0].nombreMesuresPrisesEnCompte, 98);
      assert.equal(reponse.body.modules[1].nombreMesuresPrisesEnCompte, 20);
    });
  });
});
