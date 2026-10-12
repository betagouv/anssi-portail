import { AxiosError, AxiosResponse, HttpStatusCode } from '@anssi-portail/axios';
import { PageHtmlCrisp } from '@lab-anssi/lib';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { MockCmsCrisp } from '../mockCmsCrisp.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('la ressource pages-crisp', () => {
  let serveur: Express;
  let cmsCrisp: MockCmsCrisp;

  beforeEach(() => {
    cmsCrisp = new MockCmsCrisp();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      cmsCrisp,
    });
  });

  describe("pour une requête GET sur '/api/pages-crisp/kit-relais'", () => {
    const URLKitRelai = '/api/pages-crisp/kit-relais';

    it('retourne un statut 200', async () => {
      const articleCrisp: PageHtmlCrisp = {
        titre: '',
        contenu: '',
        description: '',
        tableDesMatieres: [],
      };

      vi.spyOn(cmsCrisp, 'recupereArticle').mockResolvedValue(articleCrisp);
      const réponse = await request(serveur).get(URLKitRelai);
      expect(réponse.status).toBe(HttpStatusCode.Ok);
    });

    it("retourne l'article du kit relais", async () => {
      const articleCrisp: PageHtmlCrisp = {
        titre: 'Promouvoir MSC',
        description: 'si vous aimez MSC...',
        contenu: '<h1>Promo</h1>',
        tableDesMatieres: [
          { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
          { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
        ],
      };

      vi.spyOn(cmsCrisp, 'recupereArticle').mockResolvedValue(articleCrisp);

      const réponse = await request(serveur).get(URLKitRelai);

      const page = réponse.body;
      expect(page.titre).toBe('Promouvoir MSC');
      expect(page.description).toBe('si vous aimez MSC...');
      expect(page.contenu).toBe('<h1>Promo</h1>');
      expect(page.tableDesMatieres).toEqual([
        { id: 'Section 1', texte: 'Section 1', profondeur: 1 },
        { id: 'Section 2', texte: 'Section 2', profondeur: 1 },
      ]);
    });

    it("retourne un statut 404 lorsque l'article n'est pas trouvé par cmsCrisp", async () => {
      const réponseAxios = {
        status: HttpStatusCode.NotFound,
      } as AxiosResponse;

      const erreurAxiosNotFound = new AxiosError(
        'Request failed with status code 404',
        AxiosError.ERR_BAD_REQUEST,
        réponseAxios.config,
        undefined,
        réponseAxios
      );

      vi.spyOn(cmsCrisp, 'recupereArticle').mockRejectedValue(erreurAxiosNotFound);
      const réponse = await request(serveur).get(URLKitRelai);

      expect(réponse.status).toBe(HttpStatusCode.NotFound);
    });
  });

  describe('pour une requête GET sur un autre slug', () => {
    it('retourne un statut 404', async () => {
      const réponse = await request(serveur).get('/api/pages-crisp/un-slug-inconnu');

      expect(réponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
