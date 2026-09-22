import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe.js';
import { GenerateurCodeSessionDeGroupe } from '../../../src/metier/generateurCodeSessionDeGroupe.js';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';

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
      const reponse = await request(serveur).post('/api/sessions-groupe').send({});

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    it('ajoute une session à l’entrepôt', async () => {
      await request(serveur).post('/api/sessions-groupe').send({});

      expect(await entrepotSessionDeGroupe.tous()).toHaveLength(1);
    });

    it('répond avec le code de la session de groupe', async () => {
      generateurCodeSessionDeGroupe.genere = async () => 'AB1XI5';

      const reponse = await request(serveur).post('/api/sessions-groupe').send({});

      expect(reponse.body.code).toBe('AB1XI5');
    });

    it('répond avec le lien de la session de groupe pour les participants', async () => {
      generateurCodeSessionDeGroupe.genere = async () => 'AB1XI5';
      adaptateurEnvironnement.urlBaseMSC = () => 'https://msc.com';

      const reponse = await request(serveur).post('/api/sessions-groupe').send({});

      expect(reponse.body.lienParticipant).toBe('https://msc.com/test-maturite?session-groupe=AB1XI5');
    });
  });
});
