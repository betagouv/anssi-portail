import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { EntrepôtArticleMémoire } from '../../persistance/entrepotArticleMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
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
        .avecLaDateDeMiseÀJour(new Date('2026-10-01T14:43:00.000Z'))
        .avecLaDateDePublication(new Date('2026-10-01T17:43:00.000Z'))
        .avecLaDescription("Description de l'article 1")
        .avecLeSlug('article-un')
        .avecLeTitre('Article 1')
        .construis();
      await entrepôtArticle.ajoute(article1);

      const { body, status } = await request(serveur).get('/api/articles/article-un');

      expect(status).toBe(HttpStatusCode.Ok);
      expect(body.contenu).toBe("<div>Contenu HTML de l'article 1</div>");
      expect(body.dateDeMiseÀJour).toEqual('2026-10-01T14:43:00.000Z');
      expect(body.dateDePublication).toEqual('2026-10-01T17:43:00.000Z');
      expect(body.description).toBe("Description de l'article 1");
      expect(body.titre).toBe('Article 1');
    });

    it('répond 404 si aucun article ne correspond au slug fourni', async () => {
      const reponse = await request(serveur).get('/api/articles/article-un');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
