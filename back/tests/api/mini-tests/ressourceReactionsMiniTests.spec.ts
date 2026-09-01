import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { RéactionMiniTest } from '../../../src/metier/mini-tests/reactionMiniTest.js';
import { EntrepotReactionMiniTestMemoire } from '../../persistance/entrepotReactionMiniTestMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe('La ressource des réactions aux mini-tests', () => {
  let serveur: Express;
  let entrepotReactionMiniTest: EntrepotReactionMiniTestMemoire;

  beforeEach(() => {
    entrepotReactionMiniTest = new EntrepotReactionMiniTestMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotReactionMiniTest,
    });
  });

  describe('sur demande GET', () => {
    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/reactions-mini-tests');

      assert.equal(reponse.status, HttpStatusCode.Ok);
    });

    it('renvoie aucune réaction quand aucune n’existe', async () => {
      const reponse = await request(serveur).get('/api/reactions-mini-tests');

      assert.deepEqual(reponse.body, {
        réactions: {},
      });
    });

    it('renvoie les réactions enregistrées', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 2));
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '🔥', 1));
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('MaturiteCyber', '👍', 1));

      const reponse = await request(serveur).get('/api/reactions-mini-tests');

      assert.deepEqual(reponse.body, {
        réactions: {
          VraiFaux: { '❤️': 2, '🔥': 1 },
          MaturiteCyber: { '👍': 1 },
        },
      });
    });
  });
});
