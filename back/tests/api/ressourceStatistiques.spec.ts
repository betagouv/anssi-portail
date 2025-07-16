import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { AdaptateurMonAideCyber } from '../../src/infra/adaptateurMonAideCyber';
import { EntrepotResultatTest } from '../../src/metier/entrepotResultatTest';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { IdNiveauMaturite } from '../../src/metier/resultatTestMaturite';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';
import {
  creeResultatTest,
  hectorDurant,
  jeanneDupont,
} from './objetsPretsALEmploi';

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

      assert.equal(reponse.body.servicesEtRessourcesConsultes, 1787);
    });

    function creeListeResultatTest(
      niveau?: IdNiveauMaturite,
      nombreDeResultats: number = 1
    ) {
      return Array(nombreDeResultats)
        .keys()
        .map(() => creeResultatTest(niveau))
        .toArray();
    }

    it('renvoie le nombre de tests de maturité', async () => {
      await entrepotResultatTest.ajoute(creeResultatTest());
      await entrepotResultatTest.ajoute(creeResultatTest());
      await entrepotResultatTest.ajoute(creeResultatTest());

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.testsMaturite.total, 3);
    });

    it('renvoie le nombre de diagnostics cyber', async () => {
      monAideCyber.statistiques = async () => ({ nombreDiagnostics: 10 });

      const reponse = await request(serveur).get('/api/statistiques');

      assert.equal(reponse.body.diagnosticsCyber, 10);
    });

    it('renvoie les niveaux de maturité', async () => {
      Promise.all(
        [
          ...creeListeResultatTest('insuffisant', 1),
          ...creeListeResultatTest('emergent', 2),
          ...creeListeResultatTest('intermediaire', 3),
          ...creeListeResultatTest('confirme', 4),
          ...creeListeResultatTest('optimal', 5),
        ].map((resultat) => entrepotResultatTest.ajoute(resultat))
      );

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
