import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { NOMBRE_DE_MAILS_HAMEÇONNAGE } from '../../../../src/api/mini-tests/hameconnage/ressourceReponsesHameconnage.schema.js';
import { creeServeur } from '../../../../src/api/msc/index.js';
import { TestHameçonnageRéponseSoumise } from '../../../../src/bus/evenements/testHameconnageReponseSoumise.js';
import { TestHameçonnageTerminé } from '../../../../src/bus/evenements/testHameconnageTermine.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteurErreur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';

describe('La ressource des réponses au mini test hameçonnage', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;
  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests(fauxRapporteurErreur);
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
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
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('répond un 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
      });

      expect(réponse.status).toBe(HttpStatusCode.Created);
    });

    it("publie un évènement lorsqu'une réponse est fournie", async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
      });

      expect(busÉvénements.aRecuUnEvenement(TestHameçonnageRéponseSoumise)).toBeTruthy();
    });

    it('publie un évènement avec la réponse utilisateur', async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 1,
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
      });

      expect(busÉvénements.recupereEvenement(TestHameçonnageRéponseSoumise)?.parcours).toBe('allégé');
    });

    it("répond un 400 si le numéroRéponse n'est pas valide", async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: 12,
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('publie un évènement de fin de test lorsque la réponse fournie est la dernière', async () => {
      await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
        numéroRéponse: NOMBRE_DE_MAILS_HAMEÇONNAGE,
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
        });

      expect(busÉvénements.naPasRecuDEvenement(TestHameçonnageTerminé)).toBeTruthy();
    });
  });
});
