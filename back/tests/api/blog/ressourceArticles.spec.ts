import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { EntrepôtArticleMémoire } from '../../persistance/entrepotArticleMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { ConstructeurDeRésuméDArticle } from './constructeurDeResumeDArticle.js';

describe('La ressource des articles de blog', () => {
  let serveur: Express;
  let entrepôtArticle: EntrepôtArticleMémoire;

  beforeEach(async () => {
    entrepôtArticle = new EntrepôtArticleMémoire();
    serveur = creeServeur({ ...configurationDeTestDuServeur, entrepôtArticle });
  });

  describe('sur une requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/articles');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie la liste des articles du blog', async () => {
      const article1 = new ConstructeurDeRésuméDArticle().avecLeSlug('article-un').avecLeTitre('Article 1').construis();
      const article2 = new ConstructeurDeRésuméDArticle()
        .avecLeSlug('article-deux')
        .avecLeTitre('Article 2')
        .construis();
      await entrepôtArticle.ajoute(article1);
      await entrepôtArticle.ajoute(article2);

      const { body } = await request(serveur).get('/api/articles');

      expect(body).toHaveLength(2);
      expect(body[0].slug).toBe('article-un');
      expect(body[0].titre).toBe('Article 1');
      expect(body[1].slug).toBe('article-deux');
      expect(body[1].titre).toBe('Article 2');
    });
  });
});
