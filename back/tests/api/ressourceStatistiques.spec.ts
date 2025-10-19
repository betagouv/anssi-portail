import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurMonAideCyber } from '../../src/infra/adaptateurMonAideCyber';
import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { ResultatTestMaturiteCreateur } from '../metier/ResultatTestMaturiteCreateur';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';
import { hectorDurant, jeanneDupont } from './objetsPretsALEmploi';

describe('La ressource Statistiques', () => {
  describe('sur demande GET', () => {
    let serveur: Express;
    let entrepotUtilisateur: EntrepotUtilisateur;
    let entrepotResultatTest: EntrepotResultatTest;
    let monAideCyber: AdaptateurMonAideCyber;

    beforeEach(() => {
      entrepotUtilisateur = new EntrepotUtilisateurMemoire();
      entrepotResultatTest = new EntrepotResultatTestMemoire();
      monAideCyber = {
        creeDemandeAide: async () => {},
        statistiques: async () => ({ nombreDiagnostics: 0 }),
      };
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        entrepotUtilisateur,
        entrepotResultatTest,
        adaptateurMonAideCyber: monAideCyber,
      });
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.status, 200);
    });

    it("renvoie le nombre d'utilisateur inscrits", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      await entrepotUtilisateur.ajoute(hectorDurant);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.utilisateursInscrits, 2);
    });

    it('renvoie le nombre de services et de ressources consultés', async () => {
      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.servicesEtRessourcesConsultes, 6700);
    });

    it('renvoie le nombre de tests de maturité', async () => {
      await new ResultatTestMaturiteCreateur()
        .dansEntrepot(entrepotResultatTest)
        .creePlusieurs(3);

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.testsMaturite.total, 3);
    });

    it('renvoie le nombre de diagnostics cyber', async () => {
      monAideCyber.statistiques = async () => ({ nombreDiagnostics: 10 });

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.diagnosticsCyber, 10);
    });

    it('renvoie les niveaux de maturité', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
        entrepotResultatTest
      );
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
  });
});
