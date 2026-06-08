import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { encodeSession } from '../cookie';
import { jeanneDupont } from '../objetsPretsALEmploi';

describe("La ressource de prise en compte d'une mesure", () => {
  describe('sur une requête POST', () => {
    describe("d'un utilisateur anonyme", () => {
      it('réponds 401', async () => {
        const serveur = creeServeur(configurationDeTestDuServeur);

        const reponse = await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte');

        assert.equal(reponse.status, 401);
      });
    });
    describe("d'un utilisateur connecté", () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      it('réponds 201', async () => {
        const serveur = creeServeur(configurationDeTestDuServeur);

        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/prise-en-compte')
          .set('Cookie', cookieJeanneDupont);

        assert.equal(reponse.status, 201);
      });
    });
  });
});
