import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { creeServeur } from '@api/msc/index.js';
import { SimulationRéflexesCyberRéponseSoumise } from '@bus/evenements/simulationReflexesCyberReponseSoumise.js';
import { SimulationRéflexesCyberTerminé } from '@bus/evenements/simulationReflexesCyberTermine.js';

import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtRésultatTestRéflexesCyberMémoire } from '../../../persistance/entrepotResultatTestReflexesCyberMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../../fauxObjets.js';
import { jeanneDupont } from '../../objetsPretsALEmploi.js';

describe('La ressource des réponses à la simulation Réflexes Cyber', () => {
  let serveur: Express;
  let busÉvénements: MockBusEvenement;
  let entrepôtRésultatTestRéflexesCyber: EntrepôtRésultatTestRéflexesCyberMémoire;

  beforeEach(async () => {
    busÉvénements = fabriqueBusPourLesTests(fauxRapporteur);
    entrepôtRésultatTestRéflexesCyber = new EntrepôtRésultatTestRéflexesCyberMémoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements: busÉvénements,
      entrepôtRésultatTestRéflexesCyber,
      entrepotUtilisateur,
    });
  });

  const posteUneRéponseValide = async () => {
    await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
      idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
      idScénario: 'entreprise',
      idRôle: 'direction',
      numéroÉvènement: 1,
      réflexe: 'bon',
      score: '5/6',
    });
  };

  it('autorise l’envoi de réponses JSON depuis un site externe', async () => {
    const url = '/api/mini-tests/reflexes-cyber/reponses';
    const origine = 'https://site-externe.example';

    await request(serveur)
      .options(url)
      .set('Origin', origine)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', 'POST')
      .expect('Access-Control-Allow-Headers', 'content-type')
      .expect(HttpStatusCode.NoContent);

    await request(serveur)
      .post(url)
      .set('Origin', origine)
      .send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
        score: '5/6',
      })
      .expect('Access-Control-Allow-Origin', '*')
      .expect(HttpStatusCode.Created);

    expect(busÉvénements.aRecuUnEvenement(SimulationRéflexesCyberTerminé)).toBeTruthy();
    expect(await entrepôtRésultatTestRéflexesCyber.tous()).toEqual([]);
  });

  describe('sur une requête POST', () => {
    it('répond un 201', async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'collectivité',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
        score: '5/6',
      });

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it("répond une 400 si l'id scénario n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'mauvaisScénario',
        idRôle: 'direction',
        numéroÉvènement: 1,
        réflexe: 'bon',
        score: '5/6',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it("répond une 400 si le numéro d'évènement n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 1.5,
        réflexe: 'bon',
        score: '5/6',
      });

      expect(reponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it("publie un événement lorsqu'une réponse est fournie", async () => {
      await posteUneRéponseValide();

      expect(busÉvénements.aRecuUnEvenement(SimulationRéflexesCyberRéponseSoumise)).toBeTruthy();
    });

    it('publie un événement de fin de simulation sur la dernière question', async () => {
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
        score: '5/6',
      });

      expect(busÉvénements.aRecuUnEvenement(SimulationRéflexesCyberTerminé)).toBeTruthy();
    });

    it("ne publie pas d'événement de fin de simulation si la réponse n'est pas la derniere", async () => {
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 4,
        réflexe: 'bon',
        score: '5/6',
      });

      expect(busÉvénements.naPasRecuDEvenement(SimulationRéflexesCyberTerminé)).toBeTruthy();
    });

    it("publie les informations de l’utilisateur si elles sont disponibles sur soumission d'une réponse", async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 4,
        réflexe: 'bon',
        score: '5/6',
      });

      const événement = busÉvénements.recupereEvenement(SimulationRéflexesCyberRéponseSoumise);

      expect(événement?.codeRegion).toBe('FR-971');
      expect(événement?.codeSecteur).toBe('A');
      expect(événement?.codeTrancheEffectif).toBe('11');
    });

    it('publie les informations de l’utilisateur si elles sont disponibles sur fin de simulation', async () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'token' });
      await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').set('Cookie', [cookieJeanneDupont]).send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
        score: '5/6',
      });

      const événement = busÉvénements.recupereEvenement(SimulationRéflexesCyberTerminé);

      expect(événement?.codeRegion).toBe('FR-971');
      expect(événement?.codeSecteur).toBe('A');
      expect(événement?.codeTrancheEffectif).toBe('11');
    });

    it('entrepose le score final pour un utilisateur connecté', async () => {
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'token' });

      const réponse = await request(serveur)
        .post('/api/mini-tests/reflexes-cyber/reponses')
        .set('Cookie', [cookie])
        .send({
          idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
          idScénario: 'entreprise',
          idRôle: 'direction',
          numéroÉvènement: 6,
          réflexe: 'bon',
          score: '5/6',
        });

      expect(réponse.status).toBe(HttpStatusCode.Created);
      expect((await entrepôtRésultatTestRéflexesCyber.tous())[0].score).toEqual('5/6');
    });

    it('répond une 400 si le score est trop long', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/reflexes-cyber/reponses').send({
        idCorrélation: '01a0a561-2416-726f-84c5-7912f3dfb57e',
        idScénario: 'entreprise',
        idRôle: 'direction',
        numéroÉvènement: 6,
        réflexe: 'bon',
        score: '50/6',
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });
  });
});
