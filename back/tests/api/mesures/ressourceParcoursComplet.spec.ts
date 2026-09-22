import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Module } from '../../../src/metier/module.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
  fauxAdaptateurHachage,
  fauxAdaptateurRechercheEntreprise,
} from '../fauxObjets.js';
import { fabriqueModuleCyberdépart, jeanneDupont } from '../objetsPretsALEmploi.js';
import { mesureDeTest } from './constructeurDeMesure.js';
import { ConstructeurDeModule } from './constructeurDeModule.js';

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

      expect(reponse.status).toBe(HttpStatusCode.Ok);
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

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it("retourne 401 si l'utilisateur n'est pas connecté", async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/parcours/complet');

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('retourne les modules du parcours complet', async () => {
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(1).avecLeNom('Cyberdépart').construis());
      await entrepôtModule.ajoute(
        new ConstructeurDeModule().avecLId(2).avecLeNom('Aggravation des conséquences').construis()
      );

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules).toHaveLength(2);
      expect(reponse.body.modules[0].nom).toBe('Cyberdépart');
      expect(reponse.body.modules[0].id).toBe(1);
      expect(reponse.body.modules[1].nom).toBe('Aggravation des conséquences');
      expect(reponse.body.modules[1].id).toBe(2);
    });

    it('retourne le nombre de mesures de chaque module', async () => {
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesureDeTest().construis(), mesureDeTest().construis()];
      await entrepôtModule.ajoute(module);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules[0].nombreMesuresTotal).toBe(2);
    });

    it('retourne la cible de déblocage du badge Cyberdépart', async () => {
      const module = fabriqueModuleCyberdépart();
      module.mesures = [
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
        mesureDeTest().construis(),
      ];
      await entrepôtModule.ajoute(module);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules[0].cibleBadge).toBe(2);
    });

    it("retourne le nombre de mesures prises en compte par l'utilisateur pour chaque module", async () => {
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(1).construis());
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(2).construis());
      jeannetteDupont.nombreDeMesuresPrisesEnCompte = (module: Module) => (module.id === 1 ? 98 : 20);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules[0].nombreMesuresPrisesEnCompte).toBe(98);
      expect(reponse.body.modules[1].nombreMesuresPrisesEnCompte).toBe(20);
    });

    it('renvoie les modules du parcours triés par id', async () => {
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(5).construis());
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(3).construis());
      await entrepôtModule.ajoute(new ConstructeurDeModule().avecLId(1).construis());

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules[0].id).toBe(1);
      expect(reponse.body.modules[1].id).toBe(3);
      expect(reponse.body.modules[2].id).toBe(5);
    });

    it('renvoie la prise en compte des mesures', async () => {
      const mesure = mesureDeTest().avecLId('MESURE').construis();
      jeannetteDupont.mesuresPrisesEnCompte = [mesureDeTest().avecLId('MESURE').construis()];
      const module = new ConstructeurDeModule().construis();
      module.mesures = [mesure];
      await entrepôtModule.ajoute(module);

      const reponse = await request(serveur).get('/api/parcours/complet').set('Cookie', cookieDeJeanneDupont);

      expect(reponse.body.modules[0].mesures[0].estPriseEnCompte).toBe(true);
    });
  });
});
