import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
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

  describe("sur demande d'une page de service", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/services/mon-service-securise');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/services/mon-service-securise');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers le fichier html de jekyll', async () => {
      let idDemandé: string;
      fournisseurChemin.jekyll.service = (id: string) => {
        idDemandé = id;
        return ressourceFactice();
      };

      await request(serveur).get('/services/mon-service-securise');

      expect(idDemandé!).toBe('mon-service-securise');
    });
  });

  it('redirige le service `Mon Espace NIS 2` vers la page NIS2', async () => {
    const reponse = await request(serveur).get('/services/mon-espace-nis2.html');

    expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
    expect(reponse.headers.location).toBe('/nis2');
  });

  it.each(
    [
      'ads',
      'conseil-technique',
      'demainspecialistecyber',
      'mon-aide-cyber',
      'mon-aide-cyber-aidants',
      'mon-service-securise',
      'mooc-ebios-rm',
      'secnum-academie',
      'silene',
    ].flatMap((id) => ['', '/'].map((suffixe) => ({ id, suffixe })))
  )(
    "redirige l'ancienne URL HTML de $id avec le suffixe '$suffixe' vers l'URL sans extension",
    async ({ id, suffixe }) => {
      const reponse = await request(serveur).get(`/services/${id}.html${suffixe}`);

      expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
      expect(reponse.headers.location).toBe(`/services/${id}`);
    }
  );

  it('retourne une erreur 404 si la page n’est pas trouvée', async () => {
    fournisseurChemin.jekyll.service = (_id: string) => {
      throw new FichierInconnu('');
    };

    let estAppelé = false;
    fournisseurChemin.jekyll.page404 = () => {
      estAppelé = true;
      return ressourceFactice();
    };

    const réponse = await request(serveur).get('/services/inconnu').accept('text/html');

    expect(réponse.status).toBe(HttpStatusCode.NotFound);
    expect(réponse.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(estAppelé).toBe(true);
  });
});
