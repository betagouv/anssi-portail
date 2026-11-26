import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { creeServeur } from '@api/msc/index.js';
import { EntrepôtArticleMémoire } from '../../persistance/entrepotArticleMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { kitRelais } from '../objetsPretsALEmploi.js';
import { ConstructeurDArticleAvecToutesLesMétadonnées } from './constructeurDeResumeDArticle.js';

describe("La ressource d'un article de blog", () => {
  let serveur: Express;
  let entrepôtArticle: EntrepôtArticleMémoire;

  beforeEach(async () => {
    entrepôtArticle = new EntrepôtArticleMémoire();
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtArticle });
  });

  describe('sur une requête GET', () => {
    it('répond 200', async () => {
      const article1 = new ConstructeurDArticleAvecToutesLesMétadonnées()
        .avecLeContenu("<div>Contenu HTML de l'article 1</div>")
        .avecLaDescription("Description de l'article 1")
        .avecLeSlug('article-un')
        .avecLeTitre('Article 1')
        .construis();
      await entrepôtArticle.ajoute(article1);

      const { body, status } = await request(serveur).get('/api/articles/article-un');

      expect(status).toBe(HttpStatusCode.Ok);
      expect(body.contenu).toBe("<div>Contenu HTML de l'article 1</div>");
      expect(body.description).toBe("Description de l'article 1");
      expect(body.titre).toBe('Article 1');
    });

    it('répond 404 si aucun article ne correspond au slug fourni', async () => {
      const reponse = await request(serveur).get('/api/articles/article-un');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });

  describe("pour une requête GET sur '/api/articles/kit-relais'", () => {
    const URLKitRelai = '/api/articles/kit-relais';

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
});
