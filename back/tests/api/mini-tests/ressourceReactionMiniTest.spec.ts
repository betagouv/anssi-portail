import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { RéactionMiniTest } from '../../../src/metier/mini-tests/reactionMiniTest.js';
import { EntrepotReactionMiniTestMemoire } from '../../persistance/entrepotReactionMiniTestMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe('La ressource d’une réaction à un mini-test', () => {
  let serveur: Express;
  let entrepotReactionMiniTest: EntrepotReactionMiniTestMemoire;

  beforeEach(() => {
    entrepotReactionMiniTest = new EntrepotReactionMiniTestMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotReactionMiniTest,
    });
  });

  describe('sur demande POST', () => {
    it('renvoie 201', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 0));

      const reponse = await request(serveur).post('/api/reactions-mini-tests/VraiFaux/❤️');

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('crée la réaction concernée si elle n’existe pas', async () => {
      await request(serveur).post('/api/reactions-mini-tests/VraiFaux/❤️');

      const réactions = await entrepotReactionMiniTest.tous();
      expect(réactions).toHaveLength(1);
      expect(réactions[0].id).toBe('VraiFaux');
      expect(réactions[0].typeRéaction).toBe('❤️');
      expect(réactions[0].compteur).toBe(1);
    });

    it('incrémente une réaction concernée si elle existe', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 10));

      await request(serveur).post('/api/reactions-mini-tests/VraiFaux/❤️');

      const réactions = await entrepotReactionMiniTest.tous();
      expect(réactions).toHaveLength(1);
      expect(réactions[0].id).toBe('VraiFaux');
      expect(réactions[0].typeRéaction).toBe('❤️');
      expect(réactions[0].compteur).toBe(11);
    });

    it('répond 404 si le mini-test est inconnu', async () => {
      const reponse = await request(serveur).post('/api/reactions-mini-tests/Inconnu/❤️');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('répond 404 si le type de réaction est inconnu', async () => {
      const reponse = await request(serveur).post('/api/reactions-mini-tests/VraiFaux/❓');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });

  describe('sur demande DELETE', () => {
    it('renvoie 200', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 1));

      const reponse = await request(serveur).delete('/api/reactions-mini-tests/VraiFaux/❤️');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('décrémente le compteur de la réaction concernée', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 2));

      await request(serveur).delete('/api/reactions-mini-tests/VraiFaux/❤️');

      const réactions = await entrepotReactionMiniTest.tous();
      expect(réactions).toHaveLength(1);
      expect(réactions[0].id).toBe('VraiFaux');
      expect(réactions[0].typeRéaction).toBe('❤️');
      expect(réactions[0].compteur).toBe(1);
    });

    it('ne décrémente pas un compteur à 0', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 0));

      await request(serveur).delete('/api/reactions-mini-tests/VraiFaux/❤️');

      const réactions = await entrepotReactionMiniTest.tous();
      expect(réactions).toHaveLength(1);
      expect(réactions[0].id).toBe('VraiFaux');
      expect(réactions[0].typeRéaction).toBe('❤️');
      expect(réactions[0].compteur).toBe(0);
    });

    it('répond 404 si le mini-test est inconnu', async () => {
      const reponse = await request(serveur).delete('/api/reactions-mini-tests/Inconnu/❤️');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('répond 404 si le type de réaction est inconnu', async () => {
      const reponse = await request(serveur).delete('/api/reactions-mini-tests/VraiFaux/❓');

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });
  });
});
