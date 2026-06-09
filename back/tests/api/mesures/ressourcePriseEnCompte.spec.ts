import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { EntrepotPriseEnCompteMemoire } from '../../persistance/EntrepotPriseEnCompteMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';

describe("La ressource de prise en compte d'une mesure", () => {
  let serveur: Express;
  let entrepotPriseEnCompte: EntrepotPriseEnCompteMemoire;
  let entrepotMesure: EntrepotMesureMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  beforeEach(() => {
    entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
    entrepotMesure = new EntrepotMesureMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotPriseEnCompte,
      entrepotMesure,
      entrepotUtilisateur,
    });
  });

  describe('sur une requête POST', () => {
    describe("d'un utilisateur anonyme", () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte');

        assert.equal(reponse.status, 401);
      });
    });
    describe("d'un utilisateur connecté", () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      const mesure = mesureAuthentA2Etapes();

      beforeEach(async () => {
        await entrepotMesure.ajoute(mesure);
        await entrepotUtilisateur.ajoute(jeanneDupont);
      });

      it('réponds 201', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/prise-en-compte')
          .set('Cookie', cookieJeanneDupont);

        assert.equal(reponse.status, 201);
      });

      it('ajoute une prise en compte', async () => {
        await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookieJeanneDupont);

        const priseEnComptePersistee = await entrepotPriseEnCompte.pour(jeanneDupont, mesure);
        assert.notEqual(priseEnComptePersistee, undefined);
      });

      it("réponds 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/mesureinconnue/prise-en-compte')
          .set('Cookie', cookieJeanneDupont);

        assert.equal(reponse.status, 404);
      });
    });
  });
});
