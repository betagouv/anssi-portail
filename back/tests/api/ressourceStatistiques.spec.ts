import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurMonAideCyber } from '../../src/infra/adaptateurMonAideCyber.js';
import { AdaptateurStatistiqueMiniTestsMémoire } from '../../src/infra/adaptateurStatistiqueMiniTestsMémoire.js';
import { AdaptateurStatistiqueMiniTests } from '../../src/metier/adaptateurStatistiqueMiniTests.js';
import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest.js';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur.js';
import { ResultatTestMaturiteCreateur } from '../metier/ResultatTestMaturiteCreateur.js';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { hectorDurant, jeanneDupont } from './objetsPretsALEmploi.js';

describe('La ressource Statistiques', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepotResultatTest: EntrepotResultatTest;
    let adaptateurStatistiqueMiniTests: AdaptateurStatistiqueMiniTests;
    let monAideCyber: AdaptateurMonAideCyber;

    beforeEach(() => {
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepotResultatTest = new EntrepotResultatTestMemoire();
      adaptateurStatistiqueMiniTests = new AdaptateurStatistiqueMiniTestsMémoire();
      monAideCyber = {
        creeDemandeAide: async () => {},
      };
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
        entrepotResultatTest,
        adaptateurStatistiqueMiniTests,
        adaptateurMonAideCyber: monAideCyber,
      });
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.status, HttpStatusCode.Ok);
    });

    it("renvoie le nombre d'utilisateur inscrits", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      await entrepotUtilisateur.ajoute(hectorDurant);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.utilisateursInscrits, 2);
    });

    it('renvoie le nombre de tests de maturité', async () => {
      await new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest).creePlusieurs(3);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.testsMaturite.total, 3);
    });

    it('renvoie le nombre de diagnostics cyber', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(Number.isInteger(reponse.body.diagnosticsCyber), true);
    });

    it('renvoie la satisfaction utilisateur', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(Number.isInteger(reponse.body.satisfactionUtilisateur), true);
    });

    it('renvoie les niveaux de maturité', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
      await createur.deNiveau('insuffisant').creePlusieurs(1);
      await createur.deNiveau('emergent').creePlusieurs(2);
      await createur.deNiveau('intermediaire').creePlusieurs(3);
      await createur.deNiveau('confirme').creePlusieurs(4);
      await createur.deNiveau('optimal').creePlusieurs(5);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.deepEqual(reponse.body.testsMaturite.parNiveau, {
        insuffisant: 1,
        emergent: 2,
        intermediaire: 3,
        confirme: 4,
        optimal: 5,
      });
    });

    it('renvoie le nombres de tests vrai-faux réalisés', async () => {
      adaptateurStatistiqueMiniTests.nombreDeMiniTestsRéalisés = async () => ({ vraiFaux: 10 });

      const reponse = await request(serveur).get('/api/statistiques');

      assert.deepEqual(reponse.body.miniTests.vraiFaux, 10);
    });
  });
});
