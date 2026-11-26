import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { RéactionMiniTest } from '@metier/mini-tests/reactionMiniTest.js';
import { creeServeur } from '@api/msc/index.js';
import { EntrepotReactionMiniTestMemoire } from '../../persistance/entrepotReactionMiniTestMemoire.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { unRésultatDeTestDeMaturité } from './maturite-cyber/constructeurResultatTestMaturite.js';

describe('La ressource des informations des mini-tests', () => {
  let serveur: Express;
  let entrepotReactionMiniTest: EntrepotReactionMiniTestMemoire;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;

  beforeEach(() => {
    entrepotReactionMiniTest = new EntrepotReactionMiniTestMemoire();
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotReactionMiniTest,
      entrepôtRésultatTestMaturité,
    });
  });

  describe('sur demande GET', () => {
    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie aucune réaction quand aucune n’existe', async () => {
      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.réactions).toEqual({});
    });

    it('renvoie les réactions enregistrées', async () => {
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '❤️', 2));
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('VraiFaux', '🔥', 1));
      await entrepotReactionMiniTest.ajoute(new RéactionMiniTest('MaturiteCyber', '👍', 1));

      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.réactions).toEqual({
        VraiFaux: { '❤️': 2, '🔥': 1 },
        MaturiteCyber: { '👍': 1 },
      });
    });

    it('renvoie le compteur des tests maturité', async () => {
      for (let i = 0; i < 252; i++) {
        await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().construis());
      }

      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.compteurs.MaturiteCyber).toBe(200);
    });

    it('renvoie le compteur des tests reflexes cyber', async () => {
      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.compteurs.ReflexesCyber).toBe(5600);
    });

    it('renvoie le compteur des tests hameçonnage', async () => {
      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.compteurs.Hameconnage).toBe(3400);
    });
  });
});
