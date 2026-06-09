import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { EntrepotPriseEnCompteMemoire } from '../../persistance/EntrepotPriseEnCompteMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { MesurePriseEnCompte } from '../../../src/bus/evenements/mesurePriseEnCompte';

describe("La ressource de prise en compte d'une mesure", () => {
  let serveur: Express;
  let entrepotPriseEnCompte: EntrepotPriseEnCompteMemoire;
  let entrepotMesure: EntrepotMesureMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let busEvenements: MockBusEvenement;
  beforeEach(() => {
    entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
    entrepotMesure = new EntrepotMesureMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    busEvenements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotPriseEnCompte,
      entrepotMesure,
      entrepotUtilisateur,
      busEvenements,
    });
  });

  describe('sur une requête POST', () => {
    describe("d'un utilisateur anonyme", () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte');

        assert.equal(reponse.status, 401);
      });
    });

    describe("d'un utilisateur connecté", () => {
      const cookieJeanneDupont = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      const mesure = mesureAuthentA2Etapes();

      beforeEach(async () => {
        await entrepotMesure.ajoute(mesure);
        await entrepotUtilisateur.ajoute(jeanneDupont);
      });

      it('réponds 201', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/prise-en-compte')
          .set('Cookie', cookieJeanneDupont);

        assert.equal(reponse.status, 201);
      });

      it('ajoute une prise en compte', async () => {
        await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookieJeanneDupont);

        const priseEnComptePersistee = await entrepotPriseEnCompte.pour(jeanneDupont, mesure);
        assert.notEqual(priseEnComptePersistee, undefined);
      });

      it("réponds 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/mesureinconnue/prise-en-compte')
          .set('Cookie', cookieJeanneDupont);

        assert.equal(reponse.status, 404);
      });

      it('publie un événement de prise en compte', async () => {
        await request(serveur).post('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookieJeanneDupont);

        busEvenements.aRecuUnEvenement(MesurePriseEnCompte);
        const evenement = busEvenements.recupereEvenement(MesurePriseEnCompte);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.emailHache, 'jeanne.dupont@user.com-hache');
      });
    });
  });
});
