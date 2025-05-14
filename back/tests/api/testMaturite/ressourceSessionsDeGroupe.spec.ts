import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import { creeServeur } from '../../../src/api/msc';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
} from '../fauxObjets';
import { Express } from 'express';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire';
import { GenerateurCodeSessionDeGroupe } from '../../../src/metier/generateurCodeSessionDeGroupe';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';

describe('La ressource qui gère les sessions de groupe', () => {
  let serveur: Express;
  let entrepotSessionDeGroupe: EntrepotSessionDeGroupe;
  let generateurCodeSessionDeGroupe: GenerateurCodeSessionDeGroupe;
  let adaptateurEnvironnement: AdaptateurEnvironnement;

  beforeEach(() => {
    adaptateurEnvironnement = { ...fauxAdaptateurEnvironnement };
    entrepotSessionDeGroupe = new EntrepotSessionDeGroupeMemoire();
    generateurCodeSessionDeGroupe = { genere: async () => '' };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotSessionDeGroupe,
      generateurCodeSessionDeGroupe,
      adaptateurEnvironnement,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/sessions-groupe')
        .send({});

      assert.equal(reponse.status, 201);
    });

    it('ajoute une session à l’entrepôt', async () => {
      await request(serveur).post('/api/sessions-groupe').send({});

      assert.equal((await entrepotSessionDeGroupe.tous()).length, 1);
    });

    it('répond avec le code de la session de groupe', async () => {
      generateurCodeSessionDeGroupe.genere = async () => 'AB1XI5';

      const reponse = await request(serveur)
        .post('/api/sessions-groupe')
        .send({});

      assert.equal(reponse.body.code, 'AB1XI5');
    });

    it('répond avec le lien de la session de groupe pour les participants', async () => {
      generateurCodeSessionDeGroupe.genere = async () => 'AB1XI5';
      adaptateurEnvironnement.urlBaseMSC = () => 'https://msc.com';

      const reponse = await request(serveur)
        .post('/api/sessions-groupe')
        .send({});

      assert.equal(
        reponse.body.lienParticipant,
        'https://msc.com/test-maturite?session-groupe=AB1XI5'
      );
    });
  });
});
