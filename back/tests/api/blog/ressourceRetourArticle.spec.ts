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
    const URL = '/api/retour-article';
    let serveur: Express;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let busEvenements: MockBusEvenement;
    let entrepôtArticle: EntrepôtArticleMémoire;

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
      const retourPositif = {
        slug: 'un-article-de-blog',
        retour: 'POSITIF',
      };
      entrepôtArticle.ajoute(
        new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug('un-article-de-blog').construis()
      );
      const reponse = await request(serveur).post(URL).send(retourPositif);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const reponse = await request(serveur).post(URL).send({});

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const reponse = await request(serveur).post(URL).send({ retour: 'INVALIDE' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it('doit répondre 400 si le commentaire est trop long', async () => {
      const reponse = await request(serveur)
        .post(URL)
        .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.commentaire[0]).toBe('Le commentaire doit contenir au plus 1000 caractères');
    });

    it("doit répondre 400 si le slug fourni n'existe pas", async () => {
      const reponse = await request(serveur).post(URL).send({ retour: 'POSITIF' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.slug[0]).toBe('Le slug doit être défini');
    });

    it('doit répondre 400 si le slug est trop long', async () => {
      const reponse = await request(serveur)
        .post(URL)
        .send({ retour: 'POSITIF', slug: 'x'.repeat(2049) });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
      expect(reponse.body.fieldErrors.slug[0]).toBe('Le slug doit contenir au plus 2048 caractères');
    });

    it("doit répondre 400 si l'article correspondant au slug n'existe pas", async () => {
      const reponse = await request(serveur).post(URL).send({ retour: 'POSITIF', slug: 'article-inconnu' });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    describe('concernant les retours positifs', () => {
      const retourPositif = {
        slug: 'un-article-de-blog',
        retour: 'POSITIF',
      };

      beforeEach(async () => {
        entrepôtArticle.ajoute(
          new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug(retourPositif.slug).construis()
        );
      });

      it('publie un événement', async () => {
        await request(serveur).post(URL).send(retourPositif);

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post(URL)
          .send({ ...retourPositif, commentaire: 'Cet article est sympa !' });

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('POSITIF');
        expect(evenement!.commentaire).toBeUndefined();
      });
    });

    describe('concernant les retours négatifs', () => {
      const retourNégatif = {
        slug: 'un-article-de-blog',
        retour: 'NEGATIF',
      };

      beforeEach(async () => {
        entrepôtArticle.ajoute(
          new ConstructeurDArticleAvecToutesLesMétadonnées().avecLeSlug(retourNégatif.slug).construis()
        );
      });

      it('publie un événement', async () => {
        await request(serveur).post(URL).send(retourNégatif);

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBeUndefined();
      });

      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post(URL)
          .send({ ...retourNégatif, commentaire: 'Cet article est nul !' });

        busEvenements.aRecuUnEvenement(RetourArticleDonné);
        const evenement = busEvenements.recupereEvenement(RetourArticleDonné);
        expect(evenement!.retour).toBe('NEGATIF');
        expect(evenement!.commentaire).toBe('Cet article est nul !');
      });
    });
  });
});
