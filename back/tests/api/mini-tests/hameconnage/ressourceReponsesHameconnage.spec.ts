import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { NOMBRE_DE_MAILS_HAMEÇONNAGE } from '@api/mini-tests/hameconnage/ressourceReponsesHameconnage.schema.js';
import { creeServeur } from '@api/msc/index.js';
import { TestHameçonnageRéponseSoumise } from '@bus/evenements/testHameconnageReponseSoumise.js';
import { TestHameçonnageTerminé } from '@bus/evenements/testHameconnageTermine.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtRésultatTestHameçonnageMémoire } from '../../../persistance/entrepotResultatTestHameconnageMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';

describe('La ressource des réponses au mini test hameçonnage', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;
  let entrepôtRésultatTestHameçonnage: EntrepôtRésultatTestHameçonnageMémoire;

  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests(fauxRapporteur);
    entrepôtRésultatTestHameçonnage = new EntrepôtRésultatTestHameçonnageMémoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
      entrepôtRésultatTestHameçonnage,
      entrepotUtilisateur,
    });
  });

  describe('sur une requête POST', () => {
    it("répond une 400 si la charge utile n'est pas valide", async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'INCORRECT',
        réponse: 'non',
        numéroRéponse: 1,
        score: '5/9',
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('répond un 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
        score: '5/9',
      });

      expect(réponse.status).toBe(HttpStatusCode.Created);
    });

    it("publie un évènement lorsqu'une réponse est fournie", async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
        score: '5/9',
      });

      expect(busÉvénements.aRecuUnEvenement(TestHameçonnageRéponseSoumise)).toBeTruthy();
    });

    it('publie un évènement avec la réponse utilisateur', async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
        score: '5/9',
      });

      const événement = busÉvénements.recupereEvenement(TestHameçonnageRéponseSoumise);

      expect(événement?.idCorrélation).toBe('01a19bd7-6c3f-7592-9c6c-d12de96cbef1');
      expect(événement?.idMail).toBe('ENEDIS');
      expect(événement?.réponseCorrecte).toBe(true);
    });

    it('publie les informations de l’utilisateur si elles sont disponibles', async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
        score: '5/9',
      });

      const événement = busÉvénements.recupereEvenement(TestHameçonnageRéponseSoumise);

      expect(événement?.codeRegion).toBe('FR-971');
    });

    it("publie le parcours de l'utilisateur dans l’évènement de réponse s'il en a un", async () => {
      await jeanneDupont.rejoinsParcours('allégé', busÉvénements, 'visite-page-mesure');
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookie]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
        score: '5/9',
      });

      expect(busÉvénements.recupereEvenement(TestHameçonnageRéponseSoumise)?.parcours).toBe('allégé');
    });

    it("répond un 400 si le numéroRéponse n'est pas valide", async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 12,
        score: '5/9',
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('publie un évènement de fin de test lorsque la réponse fournie est la dernière', async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '5/9',
      });

      const événement = busÉvénements.recupereEvenement(TestHameçonnageTerminé);

      expect(événement?.idCorrélation).toBe('01a19bd7-6c3f-7592-9c6c-d12de96cbef1');
    });

    it("publie les informations de l'utilisateur dans l'évènement de fin de test si elles sont disponibles", async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '5/9',
      });

      const événement = busÉvénements.recupereEvenement(TestHameçonnageTerminé);

      expect(événement?.email).toBe(jeanneDupont.email);
      expect(événement?.codeRegion).toBe('FR-971');
    });

    it("publie le parcours de l'utilisateur dans l'évènement de fin de test s'il en a un", async () => {
      await jeanneDupont.rejoinsParcours('allégé', busÉvénements, 'visite-page-mesure');
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookie]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '5/9',
      });

      expect(busÉvénements.recupereEvenement(TestHameçonnageTerminé)?.parcours).toBe('allégé');
    });

    it("ne publie pas d'évènement de fin de test si la réponse fournie n'est pas la dernière", async () => {
      await request(serveur)
        .post('/api/mini-tests/hameconnage/reponses')
        .send({
          idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
          idMail: 'ENEDIS',
          réponse: 'bonne',
          numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE - 1,
          score: '5/9',
        });

      expect(busÉvénements.naPasRecuDEvenement(TestHameçonnageTerminé)).toBeTruthy();
    });

    it('entrepose le score final pour un utilisateur connecté', async () => {
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookie]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '5/9',
      });

      expect(réponse.status).toBe(HttpStatusCode.Created);
      expect(await entrepôtRésultatTestHameçonnage.taille()).toEqual(1);
      expect((await entrepôtRésultatTestHameçonnage.tous())[0].score).toEqual('5/9');
    });

    it("n'entrepose pas le score final s'il est trop long", async () => {
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').set('Cookie', [cookie]).send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '50/9',
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('n’entrepose pas le résultat pour un test anonyme', async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
        score: '5/9',
      });

      expect(await entrepôtRésultatTestHameçonnage.taille()).toEqual(0);
    });
  });
});
