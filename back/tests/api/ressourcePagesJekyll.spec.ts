import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { FournisseurChemin } from '@api/fournisseurChemin.js';
import { creeServeur } from '@api/msc/index.js';

import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

describe('La ressource pages jekyll', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe('sur demande de la page catalogue', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/catalogue');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/catalogue');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      await request(serveur).get('/catalogue');

      expect(nomPageDemande!).toBe('catalogue');
    });
  });

  describe('sur demande de la page favoris partagés', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/favoris-partages/monSuperId');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/favoris-partages/monSuperId');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      await request(serveur).get('/favoris-partages/monSuperId');

      expect(nomPageDemande!).toBe('favoris-partages');
    });
  });

  describe('sur demande de la page liste des contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      await request(serveur).get('/contacts');

      expect(nomPageDemande!).toBe('contacts');
    });
  });

  describe('sur demande de la page contacts', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts/fr-idf');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts/fr-idf');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });
  });

  describe("sur demande d'un guide", () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/guides/zero-trust');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      await request(serveur).get('/guides/zero-trust');

      expect(nomPageDemande!).toBe('guides');
    });
  });

  describe("sur demande de l'ancienne page NIS2", () => {
    it('redirige vers la sélection de la nouvelle page NIS2', async () => {
      const reponse = await request(serveur).get('/directive-nis2');

      expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
      expect(reponse.headers.location).toBe('/nis2');
    });
  });

  describe("sur demande de la page de l'observatoire", () => {
    const serveurAvecObservatoire = (actif: boolean) =>
      creeServeur({
        ...configurationDeTestDuServeur,
        fournisseurChemin,
        adaptateurEnvironnement: {
          ...configurationDeTestDuServeur.adaptateurEnvironnement,
          fonctionnalites: {
            ...configurationDeTestDuServeur.adaptateurEnvironnement.fonctionnalites,
            observatoire: () => actif,
          },
        },
      });

    it('sers le fichier html de jekyll lorsque la fonctionnalité est activée', async () => {
      let nomPageDemande: string;
      fournisseurChemin.jekyll.page = (nomPage: string) => {
        nomPageDemande = nomPage;
        return ressourceFactice();
      };

      const reponse = await request(serveurAvecObservatoire(true)).get('/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      expect(nomPageDemande!).toBe('observatoire');
    });

    it('répond 404 lorsque la fonctionnalité est désactivée', async () => {
      const reponse = await request(serveurAvecObservatoire(false)).get('/observatoire');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
