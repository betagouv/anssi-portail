import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { ProprieteTestRevendiquee } from '../../../src/bus/evenements/proprieteTestRevendiquee.js';
import { TestRealise } from '../../../src/bus/evenements/testRealise.js';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur, fauxAdaptateurRechercheEntreprise } from '../fauxObjets.js';
import { hectorDurant, jeanneDupont } from '../objetsPretsALEmploi.js';

const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('La ressource qui gère les résultats de test de maturité', () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotResultatTest: EntrepotResultatTestMemoire;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  const donneesCorrectes = {
    region: 'FR-NOR',
    secteur: 'J',
    tailleOrganisation: '51',
    reponses: {
      'prise-en-compte-risque': 2,
      pilotage: 3,
      budget: 5,
      'ressources-humaines': 3,
      'adoption-solutions': 2,
      posture: 3,
    },
    codeSessionGroupe: undefined,
  };

  beforeEach(() => {
    busEvenements = fabriqueBusPourLesTests();
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepotUtilisateur.ajoute(jeanneDupont);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotResultatTest,
      entrepotUtilisateur,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/resultats-test').send(donneesCorrectes);

      expect(reponse.status).toBe(HttpStatusCode.Created);
    });

    describe('concernant la publication des evenements', () => {
      it('publie un évènement du bus TestRealise', async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .send({
            region: 'FR-NOR',
            secteur: 'J',
            tailleOrganisation: '51',
            reponses: {
              'prise-en-compte-risque': 2,
              pilotage: 3,
              budget: 5,
              'ressources-humaines': 3,
              'adoption-solutions': 2,
              posture: 3,
            },
          });

        busEvenements.aRecuUnEvenement(TestRealise);
        const evenement = busEvenements.recupereEvenement(TestRealise);
        expect(evenement!.region).toBe('FR-NOR');
        expect(evenement!.secteur).toBe('J');
        expect(evenement!.tailleOrganisation).toBe('51');
        expect(evenement!.reponses).toEqual({
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        });
      });

      it('publie un évènement du bus TestRealise avec un code de session de groupe ', async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .send({
            region: 'FR-NOR',
            secteur: 'J',
            tailleOrganisation: '51',
            reponses: {
              'prise-en-compte-risque': 2,
              pilotage: 3,
              budget: 5,
              'ressources-humaines': 3,
              'adoption-solutions': 2,
              posture: 3,
            },
            codeSessionGroupe: 'ABC2ED',
          });

        busEvenements.aRecuUnEvenement(TestRealise);
        const evenement = busEvenements.recupereEvenement(TestRealise);
        expect(evenement!.codeSessionGroupe).toBe('ABC2ED');
      });
    });

    describe("lorsque l'utilisateur est connecte", () => {
      let cookie: string;

      beforeEach(() => {
        cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      });

      it("sauvegarde le résultat de test avec l'email de l'utilisateur", async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .set('Cookie', [cookie])
          .send({
            region: 'FR-NOR',
            secteur: 'J',
            tailleOrganisation: '51',
            reponses: {
              'prise-en-compte-risque': 2,
              pilotage: 3,
              budget: 5,
              'ressources-humaines': 3,
              'adoption-solutions': 2,
              posture: 3,
            },
          });

        const resultatSauvegarde = await entrepotResultatTest.dernierPourUtilisateur(jeanneDupont);

        expect(resultatSauvegarde).toBeDefined();
        expect(resultatSauvegarde?.utilisateur).toBe(jeanneDupont);
        expect(resultatSauvegarde!.region).toBe('FR-NOR');
        expect(resultatSauvegarde!.secteur).toBe('J');
        expect(resultatSauvegarde!.tailleOrganisation).toBe('51');
        expect(resultatSauvegarde!.reponses).toEqual({
          'prise-en-compte-risque': 2,
          pilotage: 3,
          budget: 5,
          'ressources-humaines': 3,
          'adoption-solutions': 2,
          posture: 3,
        });
      });

      it("retourne l'identifiant du résultat de test", async () => {
        const reponse = await request(serveur)
          .post('/api/resultats-test')
          .set('Cookie', [cookie])
          .send(donneesCorrectes);

        const resultatSauvegarde = await entrepotResultatTest.dernierPourUtilisateur(jeanneDupont);
        expect(resultatSauvegarde!.id).toMatch(REGEX_UUID);
        expect(reponse.body).toEqual({ id: resultatSauvegarde!.id });
      });

      it("publie un événement sur le bus qui indique que l'utilisateur est relié au test", async () => {
        const reponse = await request(serveur)
          .post('/api/resultats-test')
          .set('Cookie', [cookie])
          .send(donneesCorrectes);

        busEvenements.aRecuUnEvenement(ProprieteTestRevendiquee);
        const evenement = busEvenements.recupereEvenement(ProprieteTestRevendiquee);
        expect(evenement!.utilisateur).toBe(jeanneDupont);
        expect(evenement!.idResultatTest).toBe(reponse.body.id);
      });
      describe("et n'a pas renseigné des informations d'organisaton", () => {
        it("récupère les informations d'organisation et les enregistre en base", async () => {
          await request(serveur)
            .post('/api/resultats-test')
            .set('Cookie', [cookie])
            .send({
              reponses: {
                'prise-en-compte-risque': 2,
                pilotage: 3,
                budget: 5,
                'ressources-humaines': 3,
                'adoption-solutions': 2,
                posture: 3,
              },
            });

          const resultatSauvegarde = await entrepotResultatTest.dernierPourUtilisateur(jeanneDupont);

          expect(resultatSauvegarde?.region).toBe('FR-971');
          expect(resultatSauvegarde?.secteur).toBe('A');
          expect(resultatSauvegarde?.tailleOrganisation).toBe('11');
        });

        it("récupère les informations d'organisation et les publie dans le bus d'évènements", async () => {
          await request(serveur)
            .post('/api/resultats-test')
            .set('Cookie', [cookie])
            .send({
              reponses: {
                'prise-en-compte-risque': 2,
                pilotage: 3,
                budget: 5,
                'ressources-humaines': 3,
                'adoption-solutions': 2,
                posture: 3,
              },
            });

          busEvenements.aRecuUnEvenement(TestRealise);
          const evenement = busEvenements.recupereEvenement(TestRealise);
          expect(evenement?.region).toBe('FR-971');
          expect(evenement?.secteur).toBe('A');
          expect(evenement?.tailleOrganisation).toBe('11');
        });
      });
    });

    describe("lorsque l'utilisateur n'est pas connecté", () => {
      it('sauvegarde le résultat du test sans email', async () => {
        await request(serveur).post('/api/resultats-test').send(donneesCorrectes);

        const resultatSauvegarde = (await entrepotResultatTest.tous())[0];
        expect(resultatSauvegarde).toBeDefined();
        expect(resultatSauvegarde?.utilisateur).toBeUndefined();
      });
      it("ne publie pas d'événement sur le bus qui indique que l'utilisateur est relié au test", async () => {
        await request(serveur).post('/api/resultats-test').send(donneesCorrectes);

        busEvenements.naPasRecuDEvenement(ProprieteTestRevendiquee);
      });
    });

    describe('concernant la validation des données', () => {
      const requeteAvecDonneeIncorrecte = async (donnees: Record<string, unknown>) => {
        return await request(serveur)
          .post('/api/resultats-test')
          .send({
            ...donneesCorrectes,
            ...donnees,
          });
      };

      it('accepte une région avec une valeur "nulle"', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          region: null,
        });

        expect(reponse.status).toBe(HttpStatusCode.Created);
        const evenement = busEvenements.recupereEvenement(TestRealise);
        expect(evenement!.region).toBeUndefined();
      });

      it('accepte un secteur avec une valeur "nulle"', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          secteur: null,
        });

        expect(reponse.status).toBe(HttpStatusCode.Created);
        const evenement = busEvenements.recupereEvenement(TestRealise);
        expect(evenement!.secteur).toBeUndefined();
      });

      it("accepte une taille d'organisation avec une valeur 'nulle'", async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          tailleOrganisation: null,
        });

        expect(reponse.status).toBe(HttpStatusCode.Created);
        const evenement = busEvenements.recupereEvenement(TestRealise);
        expect(evenement!.tailleOrganisation).toBeUndefined();
      });

      it('valide la région', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          region: 'UneRegionInconnue',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.region[0]).toBe('Région invalide');
      });

      it('valide le secteur', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          secteur: 'UnSecteurInconnu',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.secteur[0]).toBe('Secteur invalide');
      });

      it("valide la taille d'organisation", async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          tailleOrganisation: 'UneTailleInconnue',
        });

        expect(reponse.status).toBe(HttpStatusCode.BadRequest);
        expect(reponse.body.fieldErrors.tailleOrganisation[0]).toBe("Taille d'organisation invalide");
      });

      describe('concernant les réponses', () => {
        it('valide que les réponses sont dans un objet', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: ['pasUnObjet'],
          });

          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.fieldErrors.reponses[0]).toBe('Les réponses doivent être dans un objet');
        });

        it('valide les clés de réponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { uneAutreClef: 1 },
          });

          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.fieldErrors.reponses[0]).toBe('Les clés de réponse sont invalides');
        });

        it('valide les valeurs de reponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { ...donneesCorrectes.reponses, pilotage: 0 },
          });

          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.fieldErrors.reponses[0]).toBe(
            'Les valeurs de réponses doivent être comprises entre 1 et 5'
          );
        });

        it('resiste aux réponses sous forme de tableau', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { ...donneesCorrectes.reponses, pilotage: [5] },
          });

          expect(reponse.status).toBe(HttpStatusCode.BadRequest);
          expect(reponse.body.fieldErrors.reponses[0]).toBe(
            'Les valeurs de réponses doivent être comprises entre 1 et 5'
          );
        });
      });
    });

    it("conserve le code de session de groupe s'il est présent", async () => {
      await request(serveur)
        .post('/api/resultats-test')
        .send({
          region: 'FR-NOR',
          secteur: 'J',
          tailleOrganisation: '51',
          reponses: {
            'prise-en-compte-risque': 2,
            pilotage: 3,
            budget: 5,
            'ressources-humaines': 3,
            'adoption-solutions': 2,
            posture: 3,
          },
          codeSessionGroupe: 'ABC2ED',
        });

      const resultatSauvegarde = (await entrepotResultatTest.tous())[0];

      expect(resultatSauvegarde.codeSessionGroupe).toBe('ABC2ED');
    });
  });

  describe('sur requête GET', () => {
    describe("si l'utilisateur est connecté", () => {
      let cookie: string;

      beforeEach(() => {
        cookie = encodeSession({
          email: jeanneDupont.email,
          token: 'token-jwt-ok',
        });
      });

      it('répond 200', async () => {
        const reponse = await request(serveur).get('/api/resultats-test').set('Cookie', [cookie]);

        expect(reponse.status).toBe(HttpStatusCode.Ok);
      });

      async function ajouteUnResultatDeTest(id: string, utilisateur: Utilisateur) {
        const resultatDunUtilisateur = new ResultatTestMaturite({
          secteur: 'A',
          region: 'FR-NOR',
          id,
          reponses: {},
          tailleOrganisation: '01',
        });
        await resultatDunUtilisateur.revendiquePropriete(utilisateur, fauxAdaptateurRechercheEntreprise);
        await entrepotResultatTest.ajoute(resultatDunUtilisateur);
      }

      it('renvoie les résultats de test', async () => {
        await ajouteUnResultatDeTest('test-id-1', jeanneDupont);
        await ajouteUnResultatDeTest('test-id-2', jeanneDupont);

        const reponse = await request(serveur).get('/api/resultats-test').set('Cookie', [cookie]);

        expect(reponse.body).toHaveLength(2);
        expect(reponse.body[0].id).toBe('test-id-1');
        expect(reponse.body[1].id).toBe('test-id-2');
      });

      it("renvoie uniquement les résultats de test de l'utilisateur courant", async () => {
        await ajouteUnResultatDeTest('test-id-3', hectorDurant);

        const reponse = await request(serveur).get('/api/resultats-test').set('Cookie', [cookie]);

        expect(reponse.body).toHaveLength(0);
      });

      it("ne renvoie pas l'utilisateur", async () => {
        await ajouteUnResultatDeTest('test-id-1', jeanneDupont);

        const reponse = await request(serveur).get('/api/resultats-test').set('Cookie', [cookie]);

        expect(reponse.body[0].utilisateur).toBeUndefined();
      });

      it('renvoie les informations nécessaires du test', async () => {
        const testDeJeanne = new ResultatTestMaturite({
          secteur: 'A',
          region: 'FR-NOR',
          id: 'test-id-1',
          reponses: {
            pilotage: 5,
            budget: 5,
            'prise-en-compte-risque': 5,
            'ressources-humaines': 5,
            'adoption-solutions': 5,
            posture: 5,
          },
          tailleOrganisation: '01',
          dateRealisation: new Date(2025, 8, 11),
        });
        await testDeJeanne.revendiquePropriete(jeanneDupont, fauxAdaptateurRechercheEntreprise);
        await entrepotResultatTest.ajoute(testDeJeanne);

        const reponse = await request(serveur).get('/api/resultats-test').set('Cookie', [cookie]);

        const resultatTest = reponse.body[0];
        expect(resultatTest.niveau).toBe('optimal');
        expect(new Date(resultatTest.dateRealisation).getTime()).toBe(new Date(2025, 8, 11).getTime());
        expect(resultatTest.reponses).toEqual({
          pilotage: 5,
          budget: 5,
          'prise-en-compte-risque': 5,
          'ressources-humaines': 5,
          'adoption-solutions': 5,
          posture: 5,
        });
      });
    });

    describe("si l'utilisateur n'est pas connecté", () => {
      it('répond 401', async () => {
        const reponse = await request(serveur).get('/api/resultats-test');

        expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
      });
    });
  });
});
