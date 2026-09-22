import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
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
import { utilisateurDeTest } from './constructeurDUtilisateur.js';

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

        expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
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

        expect(reponse.status).toBe(HttpStatusCode.Created);
      });

      it("doit répondre 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send(retourPositif);

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
      });

      it('doit répondre 400 si le corps de la requête est vide', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send({});

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
      });

      it("doit répondre 400 si le retour n'est pas valide", async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/NONEXISTANTE.5/avis')
          .set('Cookie', [cookie])
          .send({ retour: 'INVALIDE' });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.retour[0]).toBe('Le retour doit être "POSITIF" ou "NEGATIF"');
      });

      it('doit répondre 400 si le commentaire est trop long', async () => {
        const reponse = await request(serveur)
          .post('/api/mesures/AUTH.5/avis')
          .set('Cookie', [cookie])
          .send({ retour: 'NEGATIF', commentaire: 'x'.repeat(1001) });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.commentaire[0]).toBe('Le commentaire doit contenir au plus 1000 caractères');
      });

      describe('concernant les avis positifs', () => {
        it('publie un événement', async () => {
          const utilisateur = utilisateurDeTest()
            .avecLEmail('utilisateur@mail.com')
            .avecLeParcours('complet')
            .construis();
          await entrepotUtilisateur.ajoute(utilisateur);
          cookie = encodeSession({ email: utilisateur.email, token: 'valide' });

          await request(serveur).post('/api/mesures/AUTH.5/avis').set('Cookie', [cookie]).send(retourPositif);

          busEvenements.aRecuUnEvenement(AvisMesureDonne);
          const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
          expect(evenement!.idUtilisateur).toBe('utilisateur@mail.com-hache');
          expect(evenement!.idMesure).toBe('AUTH.5');
          expect(evenement!.parcours).toBe('complet');
          expect(evenement!.titreMesure).toBe(
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          expect(evenement!.retour).toBe('POSITIF');
        });

        it('publie un événement sans commentaire', async () => {
          await request(serveur)
            .post('/api/mesures/AUTH.5/avis')
            .set('Cookie', [cookie])
            .send({ retour: 'POSITIF', commentaire: 'Cette mesure est sympa !' });

          busEvenements.aRecuUnEvenement(AvisMesureDonne);
          const evenement = busEvenements.recupereEvenement(AvisMesureDonne);
          expect(evenement!.idUtilisateur).toBe('jeanne.dupont@user.com-hache');
          expect(evenement!.idMesure).toBe('AUTH.5');
          expect(evenement!.titreMesure).toBe(
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          expect(evenement!.retour).toBe('POSITIF');
          expect(evenement!.commentaire).toBeUndefined();
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
          expect(evenement!.idUtilisateur).toBe('jeanne.dupont@user.com-hache');
          expect(evenement!.idMesure).toBe('AUTH.5');
          expect(evenement!.titreMesure).toBe(
            'Activer la vérification en deux étapes ou un autre moyen de renforcement de la sécurité de l’accès aux comptes'
          );
          expect(evenement!.retour).toBe('NEGATIF');
          expect(evenement!.commentaire).toBe('Cette mesure est incorrecte !');
        });
      });
    });
  });
});
