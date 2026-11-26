import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { HttpStatusCode } from '@anssi-portail/axios';
import { EntrepôtRésultatTestMaturité } from '@metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { EntrepotSessionDeGroupe } from '@metier/mini-tests/maturite-cyber/entrepotSessionDeGroupe.js';
import { SessionDeGroupe } from '@metier/mini-tests/maturite-cyber/sessionDeGroupe.js';
import { creeServeur } from '@api/msc/index.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepotSessionDeGroupeMemoire } from '../../../persistance/entrepotSessionDeGroupeMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { unRésultatDeTestDeMaturité } from './constructeurResultatTestMaturite.js';

describe("La ressource qui gère les résultats d'une session de groupe", () => {
  let serveur: Express;
  let entrepotSessionDeGroupe: EntrepotSessionDeGroupe;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturité;
  const generateurCodeSessionDeGroupe = (code: string) => ({
    genere: async () => code,
  });

  beforeEach(() => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    entrepotSessionDeGroupe = new EntrepotSessionDeGroupeMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotSessionDeGroupe,
      entrepôtRésultatTestMaturité,
    });
  });

  describe('sur requête GET', () => {
    it('répond 200 lorsque la session existe', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(generateurCodeSessionDeGroupe('ABC2ED'));
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);

      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED/resultats').send();

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("répond 404 si la session n'existe pas", async () => {
      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED/resultats').send();

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it("répond 0 participant en cas d'absence de résultats", async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(generateurCodeSessionDeGroupe('ABC2ED'));
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);

      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED/resultats').send();

      expect(reponse.body.nombreParticipants).toEqual(0);
    });

    it('répond le nombre de participants en cas de résultats', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(generateurCodeSessionDeGroupe('ABC2ED'));
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);
      await entrepôtRésultatTestMaturité.ajoute(
        await unRésultatDeTestDeMaturité().avecCodeSessionGroupe('ABC2ED').construis()
      );

      const reponse = await request(serveur).get('/api/sessions-groupe/ABC2ED/resultats').send();

      expect(reponse.body.nombreParticipants).toEqual(1);
    });
  });
});
