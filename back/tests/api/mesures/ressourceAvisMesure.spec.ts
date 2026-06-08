import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête POST', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;

    const retourPositif = {
      retour: 'POSITIF',
    };

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
      });
    });

    it('doit répondre 201', async () => {
      const reponse = await request(serveur).post('/api/mesures/AUTH.5/avis').send(retourPositif);

      assert.equal(reponse.status, 201);
    });

    it("doit répondre 404 si la mesure n'existe pas", async () => {
      const reponse = await request(serveur).post('/api/mesures/NONEXISTANTE.5/avis').send(retourPositif);

      assert.equal(reponse.status, 404);
    });

    it('doit répondre 400 si le corps de la requête est vide', async () => {
      const reponse = await request(serveur).post('/api/mesures/NONEXISTANTE.5/avis').send({});

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
    });

    it("doit répondre 400 si le retour n'est pas valide", async () => {
      const reponse = await request(serveur).post('/api/mesures/NONEXISTANTE.5/avis').send({ retour: 'INVALIDE' });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
    });
  });
});
