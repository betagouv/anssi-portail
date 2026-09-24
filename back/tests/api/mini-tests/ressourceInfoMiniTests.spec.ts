import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { RéactionMiniTest } from '../../../src/metier/mini-tests/reactionMiniTest.js';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite.js';
import { EntrepotReactionMiniTestMemoire } from '../../persistance/entrepotReactionMiniTestMemoire.js';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe('La ressource des informations des mini-tests', () => {
  let serveur: Express;
  let entrepotReactionMiniTest: EntrepotReactionMiniTestMemoire;
  let entrepotResultatTest: EntrepotResultatTestMemoire;

  beforeEach(() => {
    entrepotReactionMiniTest = new EntrepotReactionMiniTestMemoire();
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotReactionMiniTest,
      entrepotResultatTest,
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
        await entrepotResultatTest.ajoute(
          new ResultatTestMaturite({ region: 'FR-NAQ', secteur: 'A', tailleOrganisation: '00', reponses: { a: 0 } })
        );
      }

      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.compteurs.MaturiteCyber).toBe(200);
    });

    it('renvoie le compteur des tests reflexes cyber', async () => {
      const reponse = await request(serveur).get('/api/info-mini-tests');

      expect(reponse.body.compteurs.ReflexesCyber).toBe(5600);
    });
  });
});
