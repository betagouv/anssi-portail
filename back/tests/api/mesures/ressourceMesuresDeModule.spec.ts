import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../../src/metier/utilisateur';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
  fauxAdaptateurRechercheEntreprise,
} from '../fauxObjets';
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { mesureDeTest } from './constructeurDeMesure';

describe('La ressource des mesures de sécurité d’un module', () => {
  describe('sur requête GET', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let entrepotUtilisateur: EntrepotUtilisateur;
    const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        entrepotUtilisateur,
        adaptateurEnvironnement,
      });
      await entrepotUtilisateur.ajoute(jeanneDupont);
    });

    const getMesuresConnecte = async () =>
      request(serveur).get('/api/modules/cyberdepart/mesures').set('Cookie', cookieJeanneDupont);

    it('réponds 200', async () => {
      const reponse = await getMesuresConnecte();

      assert.equal(reponse.status, 200);
    });

    it('réponds 401 si l’utilisateur n’est pas connecté', async () => {
      const reponse = await request(serveur).get('/api/modules/cyberdepart/mesures');

      assert.equal(reponse.status, 401);
    });

    it('renvoie la liste des mesures', async () => {
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());

      const { body } = await getMesuresConnecte();

      assert.equal(body.length, 1);
      assert.equal(body[0].id, 'AUTH.5');
    });

    it('trie les mesures par ordre', async () => {
      await entrepotMesure.ajoute(mesureDeTest().avecLId('MES1').avecLOrdre(30).construis());
      await entrepotMesure.ajoute(mesureDeTest().avecLId('MES2').avecLOrdre(10).construis());

      const { body } = await getMesuresConnecte();

      assert.equal(body[0].id, 'MES2');
      assert.equal(body[1].id, 'MES1');
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
      const reponse = await request(serveurSansLaRessource).get('/api/modules/cyberdepart/mesures');

      assert.equal(reponse.status, 404);
    });

    it('indique si les mesures ont été prises en compte', async () => {
      const mesureAuth5 = mesureAuthentA2Etapes();
      const jeanDupont: Utilisateur = new Utilisateur(
        {
          email: 'hector.durant@mail.com',
          prenom: 'Hector',
          nom: 'Durant',
          telephone: '0123456789',
          domainesSpecialite: ['RSSI'],
          siretEntite: '13000766900018',
          cguAcceptees: true,
          infolettreAcceptee: true,
          mesuresPrisesEnCompte: [mesureAuth5],
        },
        fauxAdaptateurRechercheEntreprise
      );
      const cookieJeanDupont = encodeSession({ email: jeanDupont.email, token: 'valide' });
      await entrepotMesure.ajoute(mesureAuth5);
      await entrepotUtilisateur.ajoute(jeanDupont);
      await entrepotMesure.ajoute(mesureDeTest().avecLId('MES1').avecLOrdre(15).construis());

      const { body } = await request(serveur).get('/api/modules/cyberdepart/mesures').set('Cookie', cookieJeanDupont);

      assert.equal(body[0].estPriseEnCompte, true);
      assert.equal(body[1].estPriseEnCompte, false);
    });
  });
});
