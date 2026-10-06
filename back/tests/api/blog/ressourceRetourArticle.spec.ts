import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { RetourArticleDonné } from '../../../src/bus/evenements/retourArticleDonne.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepôtArticleMémoire } from '../../persistance/entrepotArticleMemoire.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { ConstructeurDArticleAvecToutesLesMétadonnées } from './constructeurDeResumeDArticle.js';

describe('La ressource retour sur les articles', () => {
  describe('sur requête POST', () => {
    const URL = (slug: string) => `/api/articles/${slug}/avis`;
    let serveur: Express;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let busEvenements: MockBusEvenement;
    let entrepôtArticle: EntrepôtArticleMémoire;
    const retourPositif = {
      retour: 'POSITIF',
    };

    beforeEach(async () => {
      entrepôtArticle = new EntrepôtArticleMémoire();

      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      busEvenements = fabriqueBusPourLesTests();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        adaptateurEnvironnement,
        busEvenements,
        entrepôtArticle,
      });
    });

    it('doit répondre 201', async () => {
      entrepôtArticle.ajoute(
        new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug('un-article-de-blog').construis()
      );
      const reponse = await request(serveur).post(URL('un-article-de-blog')).send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const reponse = await request(serveur).post(URL('un-article')).send({});

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const reponse = await request(serveur).post(URL('un-article')).send({ retour: 'INVALIDE' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it('doit répondre 400 si le commentaire est trop long', async () => {
      const reponse = await request(serveur)
        .post(URL('un-article'))
        .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.commentaire[0]).toBe('Le commentaire doit contenir au plus 1000 caractères');
    });

    it("doit répondre 404 si l'article correspondant au slug n'existe pas", async () => {
      const reponse = await request(serveur).post(URL('un-article-inconnu')).send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    describe('concernant les retours positifs', () => {
      beforeEach(async () => {
        entrepôtArticle.ajoute(
          new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug('un-article-de-blog').construis()
        );
      });

      it('publie un événement', async () => {
        await request(serveur).post(URL('un-article-de-blog')).send(retourPositif);

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post(URL('un-article-de-blog'))
          .send({ ...retourPositif, commentaire: 'Cet article est sympa !' });

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('POSITIF');
        expect(evenement!.commentaire).toBeUndefined();
      });
    });

    describe('concernant les retours négatifs', () => {
      const retourNégatif = {
        retour: 'NEGATIF',
      };

      beforeEach(async () => {
        entrepôtArticle.ajoute(
          new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug('un-article-de-blog').construis()
        );
      });

      it('publie un événement', async () => {
        await request(serveur).post(URL('un-article-de-blog')).send(retourNégatif);

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBeUndefined();
      });

      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post(URL('un-article-de-blog'))
          .send({ ...retourNégatif, commentaire: 'Cet article est nul !' });

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBe('Cet article est nul !');
      });
    });
  });
});
