import { HttpStatusCode } from '@anssi-portail/axios';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { EntrepôtArticleMémoire } from '../persistance/entrepotArticleMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { kitRelais } from './objetsPretsALEmploi.js';

describe('la ressource pages-crisp', () => {
  const entrepôtArticle = new EntrepôtArticleMémoire();
  const serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtArticle });

  describe("pour une requête GET sur '/api/pages-crisp/kit-relais'", () => {
    const URLKitRelai = '/api/pages-crisp/kit-relais';

    it('retourne un statut 200', async () => {
      const réponse = await request(serveur).get(URLKitRelai);
      expect(réponse.status).toBe(HttpStatusCode.Ok);
    });

    it("retourne l'article du kit relais", async () => {
      vi.spyOn(entrepôtArticle, 'kitRelais').mockResolvedValue(kitRelais);
      const réponse = await request(serveur).get(URLKitRelai);

      const page = réponse.body;
      expect(page.titre).toBe(kitRelais.titre);
      expect(page.description).toBe(kitRelais.description);
      expect(page.contenu).toBe(kitRelais.contenu);
      expect(page.tableDesMatières).toEqual(kitRelais.tableDesMatières);
    });
  });

  describe('pour une requête GET sur un autre slug', () => {
    it('retourne un statut 404', async () => {
      const réponse = await request(serveur).get('/api/pages-crisp/un-slug-inconnu');

      expect(réponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
