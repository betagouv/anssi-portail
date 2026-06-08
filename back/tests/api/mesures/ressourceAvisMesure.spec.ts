import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { AvisMesureDonne } from '../../../src/bus/evenements/avisMesureDonne';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête POST', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let busEvenements: MockBusEvenement;

    const retourPositif = {
      retour: 'POSITIF',
    };

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotMesure = new EntrepotMesureMemoire();
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());
      busEvenements = fabriqueBusPourLesTests();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotMesure,
        adaptateurEnvironnement,
        busEvenements,
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

    describe('concernant les avis positifs', () => {
      it('publie un événement', async () => {
        await request(serveur).post('/api/mesures/AUTH.5/avis').send(retourPositif);

        busEvenements.aRecuUnEvenement(AvisMesureDonne);
        const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.retour, 'POSITIF');
      });

      it('publie un événement sans commentaire', async () => {
        await request(serveur)
          .post('/api/mesures/AUTH.5/avis')
          .send({ retour: 'POSITIF', commentaire: 'Cette mesure est sympa !' });

        busEvenements.aRecuUnEvenement(AvisMesureDonne);
        const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.retour, 'POSITIF');
        assert.equal(evenement!.commentaire, undefined);
      });
    });

    describe('concernant les avis négatifs', () => {
      it('publie un événement avec commentaire', async () => {
        await request(serveur)
          .post('/api/mesures/AUTH.5/avis')
          .send({ retour: 'NEGATIF', commentaire: 'Cette mesure est incorrecte !' });

        busEvenements.aRecuUnEvenement(AvisMesureDonne);
        const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.retour, 'NEGATIF');
        assert.equal(evenement!.commentaire, 'Cette mesure est incorrecte !');
      });
    });
  });
});
