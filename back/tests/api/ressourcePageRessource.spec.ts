import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { FichierInconnu, FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

describe('La ressource page Service', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe("sur demande d'une page de ressource", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/ressources/cot');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/ressources/cot');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idDemandé: string;
      fournisseurChemin.jekyll.ressource = (id: string) => {
        idDemandé = id;
        return ressourceFactice();
      };

      await request(serveur).get('/ressources/cot');

      expect(idDemandé!).toBe('cot');
    });
  });

  for (const id of ['cyber-enjeux', 'cyber-enjeux-pro', 'reflexes-cyber', 'secnumedu']) {
    it(`redirige l'ancienne URL HTML de ${id} vers l'URL sans extension`, async () => {
      for (const suffixe of ['', '/']) {
        const reponse = await request(serveur).get(`/ressources/${id}.html${suffixe}`);

        expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
        expect(reponse.headers.location).toBe(`/ressources/${id}`);
      }
    });
  }

  it('retourne une erreur 404 si la page n’est pas trouvée', async () => {
    fournisseurChemin.jekyll.ressource = (_id: string) => {
      throw new FichierInconnu('');
    };

    let estAppelé = false;
    fournisseurChemin.jekyll.page404 = () => {
      estAppelé = true;
      return ressourceFactice();
    };

    const réponse = await request(serveur).get('/ressources/inconnu').accept('text/html');

    expect(réponse.status).toBe(HttpStatusCode.NotFound);
    expect(réponse.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(estAppelé).toBe(true);
  });
});
