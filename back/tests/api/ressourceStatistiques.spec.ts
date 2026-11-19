import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc/index.js';
import { AdaptateurMonAideCyber } from '../../src/infra/adaptateurMonAideCyber.js';
import { AdaptateurStatistiqueMiniTestsMémoire } from '../../src/infra/adaptateurStatistiqueMiniTestsMémoire.js';
import { AdaptateurStatistiqueParcoursMémoire } from '../../src/infra/adaptateurStatistiqueParcoursMémoire.js';
import { AdaptateurStatistiqueParcours } from '../../src/metier/adaptateurStatistiqueParcours.js';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur.js';
import { AdaptateurStatistiqueMiniTests } from '../../src/metier/mini-tests/adaptateurStatistiqueMiniTests.js';
import { EntrepôtRésultatTestMaturité } from '../../src/metier/mini-tests/maturite-cyber/entrepotResultatTestMaturite.js';
import { Statistiques } from '../../src/metier/statistiques.js';
import { ResultatTestMaturiteCreateur } from '../metier/mini-tests/maturite-cyber/ResultatTestMaturiteCreateur.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { hectorDurant, jeanneDupont } from './objetsPretsALEmploi.js';

describe('La ressource Statistiques', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturité;
    let adaptateurStatistiqueMiniTests: AdaptateurStatistiqueMiniTests;
    let adaptateurStatistiqueParcours: AdaptateurStatistiqueParcours;
    let monAideCyber: AdaptateurMonAideCyber;
    let statistiquesParDéfaut: Statistiques['miniTests'];

    beforeEach(() => {
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
      adaptateurStatistiqueMiniTests = new AdaptateurStatistiqueMiniTestsMémoire();
      adaptateurStatistiqueParcours = new AdaptateurStatistiqueParcoursMémoire();
      monAideCyber = {
        creeDemandeAide: async () => {},
      };
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
        entrepôtRésultatTestMaturité,
        adaptateurStatistiqueMiniTests,
        adaptateurStatistiqueParcours,
        adaptateurMonAideCyber: monAideCyber,
      });

      statistiquesParDéfaut = {
        exposition: 0,
        vraiFaux: 0,
        reflexesCyber: 0,
        hameconnage: 0,
      };
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("renvoie le nombre d'utilisateur inscrits", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      await entrepotUtilisateur.ajoute(hectorDurant);

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.utilisateursInscrits).toBe(2);
    });

    it('renvoie le nombre de tests de maturité', async () => {
      await new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité).creePlusieurs(3);

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.testsMaturite.total).toBe(3);
    });

    it('renvoie le nombre de diagnostics cyber', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      expect(Number.isInteger(reponse.body.diagnosticsCyber)).toBe(true);
    });

    it('renvoie la satisfaction utilisateur', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      expect(Number.isInteger(reponse.body.satisfactionUtilisateur)).toBe(true);
    });

    it('renvoie les niveaux de maturité', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
      await createur.deNiveau('insuffisant').creePlusieurs(1);
      await createur.deNiveau('emergent').creePlusieurs(2);
      await createur.deNiveau('intermediaire').creePlusieurs(3);
      await createur.deNiveau('confirme').creePlusieurs(4);
      await createur.deNiveau('optimal').creePlusieurs(5);

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.testsMaturite.parNiveau).toEqual({
        insuffisant: 1,
        emergent: 2,
        intermediaire: 3,
        confirme: 4,
        optimal: 5,
      });
    });

    it('renvoie le nombres de tests vrai-faux réalisés', async () => {
      adaptateurStatistiqueMiniTests.nombreDeMiniTestsRéalisés = async () => ({
        ...statistiquesParDéfaut,
        vraiFaux: 10,
      });

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.miniTests.vraiFaux).toEqual(10);
    });

    it('renvoie le nombres de tests exposition réalisés', async () => {
      adaptateurStatistiqueMiniTests.nombreDeMiniTestsRéalisés = async () => ({
        ...statistiquesParDéfaut,
        exposition: 20,
      });

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.miniTests.exposition).toEqual(20);
    });

    it('renvoie le nombres de parcours de sécurisation démarrés', async () => {
      adaptateurStatistiqueParcours.nombreDeParcoursDémarrés = async () => 12;

      const reponse = await request(serveur).get('/api/statistiques');

      expect(reponse.body.parcoursSécurisation.nombreDémarrés).toEqual(12);
    });
  });
});
