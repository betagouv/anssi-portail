import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxAdaptateurRechercheEntreprise,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { fabriqueMiddleware } from '../../src/api/middleware';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

describe('La ressource Annuaire Départements', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      fournisseurChemin: fauxFournisseurDeChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
      entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      adaptateurRechercheEntreprise: fauxAdaptateurRechercheEntreprise,
    });
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/departements');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les départements du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/departements');

      assert.equal(reponse.body[0].nom, 'Ain');
      assert.equal(reponse.body[0].code, '01');
    });
  });
});
