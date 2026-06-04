import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { join } from 'path';
import request from 'supertest';
import { FournisseurChemin } from '../../src/api/fournisseurChemin';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin } from './fauxObjets';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee';
import { encodeSession } from './cookie';
import { jeanneDupont } from './objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

describe('La ressource pages jekyll', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    busEvenements = fabriqueBusPourLesTests();

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      fournisseurChemin,
      entrepotUtilisateur,
    });
  });

  describe('sur demande de la page catalogue', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/catalogue');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/catalogue');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/catalogue');

      assert.equal(nomPageDemande!, 'catalogue');
    });
  });

  describe('sur demande de la page favoris partagés', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/favoris-partages/monSuperId');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/favoris-partages/monSuperId');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/favoris-partages/monSuperId');

      assert.equal(nomPageDemande!, 'favoris-partages');
    });
  });

  describe('sur demande de la page liste des contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/contacts');

      assert.equal(nomPageDemande!, 'contacts');
    });
  });

  describe('sur demande de la page contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts/FR-IDF');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts/FR-IDF');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/contacts/FR-IDF');

      assert.equal(nomPageDemande!, 'contacts');
    });
  });

  describe("sur demande d'un guide", () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      assert.equal(reponse.status, 200);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      assert.notEqual(reponse.headers['content-type'], undefined);
      assert.match(reponse.headers['content-type'], /html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.cheminPageJekyll = (nomPage: string) => {
        nomPageDemande = nomPage;
        return join(process.cwd(), 'tests', 'ressources', 'factice.html');
      };

      await request(serveur).get('/guides/zero-trust');

      assert.equal(nomPageDemande!, 'guides');
    });
  });

  describe("sur demande de l'ancienne page NIS2", () => {
    it('redirige vers la sélection de la nouvelle page NIS2', async () => {
      const reponse = await request(serveur).get('/directive-nis2');

      assert.equal(reponse.status, 301);
      assert.equal(reponse.headers.location, '/nis2');
    });
  });

  describe("sur demande d'une mesure", () => {
    it("trace la visite lorsque qu'un utilisateur est connecté", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

      const reponse = await request(serveur).get('/mesures/AUTH.5').set('Cookie', [cookie]);

      assert.equal(reponse.status, 200);
      busEvenements.aRecuUnEvenement(MesureConsultee);
      const evenement = busEvenements.recupereEvenement(MesureConsultee);
      assert.equal(evenement!.idMesure, 'AUTH.5');
      assert.equal(evenement!.emailHache, 'jeanne.dupont@user.com-hache');
    });

    it("ne trace pas la visite si aucun utilisateur n'est connecté", async () => {
      const reponse = await request(serveur).get('/mesures/AUTH.5');

      assert.equal(reponse.status, 200);
      busEvenements.naPasRecuDEvenement(MesureConsultee);
    });

    it("ne trace pas la visite d'une mesure mal nommée", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

      const reponse = await request(serveur).get('/mesures/auth5').set('Cookie', [cookie]);

      assert.equal(reponse.status, 200);
      busEvenements.naPasRecuDEvenement(MesureConsultee);
    });
  });
});
