import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { jeanneDupont } from '../objetsPretsALEmploi.js';
import { unRésultatDeTestDeMaturité } from './maturite-cyber/constructeurResultatTestMaturite.js';

describe('La ressource de mes mini tests', () => {
  let serveur: Express;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(async () => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepôtRésultatTestMaturité,
      entrepotUtilisateur,
    });
  });

  describe('sur demande GET', () => {
    async function getConnecté() {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      return await request(serveur).get('/api/mes-mini-tests').set('Cookie', [cookieJeanneDupont]);
    }

    it('renvoie 200', async () => {
      const réponse = await getConnecté();

      expect(réponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie 401 pour un utilisateur non connecté', async () => {
      const réponse = await request(serveur).get('/api/mes-mini-tests');

      expect(réponse.status).toBe(HttpStatusCode.Unauthorized);
    });

    it('indique que le test de maturité a été réalisé', async () => {
      await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().pour(jeanneDupont).construis());

      const réponse = await getConnecté();

      expect(réponse.body.maturité.réalisé).toBe(true);
    });

    it('indique que le test de maturité n’a pas été réalisé', async () => {
      const réponse = await getConnecté();

      expect(réponse.body.maturité.réalisé).toBe(false);
    });
  });
});
