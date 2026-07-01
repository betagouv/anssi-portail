import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { AvisMesureDonne } from '../../../src/bus/evenements/avisMesureDonne.js';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets.js';
import { jeanneDupont, mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';

describe('La ressource avis sur une mesure de sécurité', () => {
  describe('sur requête POST', () => {
    let serveur: Express;
    let entrepotMesure: EntrepotMesureMemoire;
    let adaptateurEnvironnement: AdaptateurEnvironnement;
    let busEvenements: MockBusEvenement;
    let entrepotUtilisateur: EntrepotUtilisateur;

    const retourPositif = {
      retour: 'POSITIF',
    };

    beforeEach(async () => {
      adaptateurEnvironnement = {
        ...fauxAdaptateurEnvironnement,
      };
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      await entrepotUtilisateur.ajoute(jeanneDupont);
      entrepotMesure = new EntrepotMesureMemoire();
      await entrepotMesure.ajoute(mesureAuthentA2Etapes());
      busEvenements = fabriqueBusPourLesTests();
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
        entrepotMesure,
        adaptateurEnvironnement,
        busEvenements,
      });
    });

    describe("si aucun utilisateur n'est connecté", () => {
      it('doit répondre 401', async () => {
        const reponse = await request(serveur).post('/api/mesures/AUTH.5/avis').send(retourPositif);

        assert.equal(reponse.status, 401);
      });
    });

    describe('si un utilisateur est connecté', () => {
      let cookie: string;

      beforeEach(() => {
        cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      });

      it('doit répondre 201', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/avis')
          .set('Cookie', [cookie])
          .send(retourPositif);

        assert.equal(reponse.status, 201);
      });

      it("doit répondre 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send(retourPositif);

        assert.equal(reponse.status, 404);
      });

      it('doit répondre 400 si le corps de la requête est vide', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send({});

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
      });

      it("doit répondre 400 si le retour n'est pas valide", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send({ retour: 'INVALIDE' });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.fieldErrors.retour[0], 'Le retour doit être "POSITIF" ou "NEGATIF"');
      });

      it('doit répondre 400 si le commentaire est trop long', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/avis')
          .set('Cookie', [cookie])
          .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.fieldErrors.commentaire[0], 'Le commentaire doit contenir au plus 1000 caractères');
      });

      describe('concernant les avis positifs', () => {
        it('publie un événement', async () => {
          await request(serveur).post('/api/mesures/AUTH.5/avis').set('Cookie', [cookie]).send(retourPositif);

          busEvenements.aRecuUnEvenement(AvisMesureDonne);
          const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
          assert.equal(evenement!.idUtilisateur, 'jeanne.dupont@user.com-hache');
          assert.equal(evenement!.idMesure, 'AUTH.5');
          assert.equal(
            evenement!.titreMesure,
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          assert.equal(evenement!.retour, 'POSITIF');
        });

        it('publie un événement sans commentaire', async () => {
          await request(serveur)
            .post('/api/mesures/AUTH.5/avis')
            .set('Cookie', [cookie])
            .send({ retour: 'POSITIF', commentaire: 'Cette mesure est sympa !' });

          busEvenements.aRecuUnEvenement(AvisMesureDonne);
          const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
          assert.equal(evenement!.idUtilisateur, 'jeanne.dupont@user.com-hache');
          assert.equal(evenement!.idMesure, 'AUTH.5');
          assert.equal(
            evenement!.titreMesure,
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          assert.equal(evenement!.retour, 'POSITIF');
          assert.equal(evenement!.commentaire, undefined);
        });
      });

      describe('concernant les avis négatifs', () => {
        it('publie un événement avec commentaire', async () => {
          await request(serveur)
            .post('/api/mesures/AUTH.5/avis')
            .set('Cookie', [cookie])
            .send({ retour: 'NEGATIF', commentaire: 'Cette mesure est incorrecte !' });

          busEvenements.aRecuUnEvenement(AvisMesureDonne);
          const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
          assert.equal(evenement!.idUtilisateur, 'jeanne.dupont@user.com-hache');
          assert.equal(evenement!.idMesure, 'AUTH.5');
          assert.equal(
            evenement!.titreMesure,
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          assert.equal(evenement!.retour, 'NEGATIF');
          assert.equal(evenement!.commentaire, 'Cette mesure est incorrecte !');
        });
      });
    });
  });
});
