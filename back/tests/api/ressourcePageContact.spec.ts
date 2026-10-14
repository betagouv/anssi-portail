import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FournisseurChemin } from '../../src/api/fournisseurChemin.js';
import { creeServeur } from '../../src/api/msc/index.js';
import { configurationDeTestDuServeur, fauxFournisseurDeChemin, ressourceFactice } from './fauxObjets.js';

describe('La ressource page Contact', () => {
  let serveur: Express;
  let fournisseurChemin: FournisseurChemin;

  beforeEach(() => {
    fournisseurChemin = fauxFournisseurDeChemin;
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      fournisseurChemin,
    });
  });

  describe("sur demande d'une page de contact", () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/contacts/fr-naq');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu html', async () => {
      const reponse = await request(serveur).get('/contacts/fr-naq');

      expect(reponse.headers['content-type']).toBeDefined();
      expect(reponse.headers['content-type']).toMatch(/html/);
    });

    it('sers la page des contacts', async () => {
      const espionFournisseurDeChemin = vi.spyOn(fournisseurChemin.jekyll, 'page').mockReturnValue(ressourceFactice());

      await request(serveur).get('/contacts/fr-naq');

      expect(espionFournisseurDeChemin).toHaveBeenCalledExactlyOnceWith('contacts');
    });

    it('accepte le code région quelle que soit la casse', async () => {
      const reponse = await request(serveur).get('/contacts/FR-NAQ');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });
  });

  it.each(
    [
      'fr-20r',
      'fr-971',
      'fr-972',
      'fr-973',
      'fr-974',
      'fr-976',
      'fr-ara',
      'fr-bfc',
      'fr-bl',
      'fr-bre',
      'fr-cp',
      'fr-cvl',
      'fr-ges',
      'fr-hdf',
      'fr-idf',
      'fr-mf',
      'fr-naq',
      'fr-nc',
      'fr-nor',
      'fr-occ',
      'fr-pac',
      'fr-pdl',
      'fr-pf',
      'fr-pm',
      'fr-tf',
      'fr-wf',
    ].flatMap((id) => ['', '/'].map((suffixe) => ({ id, suffixe })))
  )(
    "redirige l'ancienne URL HTML de $id avec le suffixe '$suffixe' vers l'URL sans extension",
    async ({ id, suffixe }) => {
      const reponse = await request(serveur).get(`/contacts/${id}.html${suffixe}`);

      expect(reponse.status).toBe(HttpStatusCode.MovedPermanently);
      expect(reponse.headers.location).toBe(`/contacts/${id}`);
    }
  );

  it('retourne une erreur 404 si la région est inconnue', async () => {
    const page404 = vi.spyOn(fournisseurChemin.jekyll, 'page404').mockReturnValue(ressourceFactice());

    const réponse = await request(serveur).get('/contacts/inconnu').accept('text/html');

    expect(réponse.status).toBe(HttpStatusCode.NotFound);
    expect(réponse.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(page404).toHaveBeenCalledOnce();
  });
});
