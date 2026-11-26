import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { creeServeur } from '@api/msc/index.js';
import { ProprieteTestRevendiquee } from '@bus/evenements/proprieteTestRevendiquee.js';

import { fabriqueBusPourLesTests, MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../../cookie.js';
import { configurationDeTestDuServeur, fauxRapporteur } from '../../fauxObjets.js';
import { hectorDurant, jeanneDupont } from '../../objetsPretsALEmploi.js';
import { unRésultatDeTestDeMaturité } from './constructeurResultatTestMaturite.js';

describe('La ressource qui gère un résultat de test', () => {
  let serveur: Express;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;
  let cookieJeanneDupont: string;
  let busEvenements: MockBusEvenement;

  beforeEach(async () => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    const entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    await entrepotUtilisateur.ajoute(jeanneDupont);
    cookieJeanneDupont = encodeSession({
      email: jeanneDupont.email,
      token: 'token',
    });
    busEvenements = fabriqueBusPourLesTests(fauxRapporteur);
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepôtRésultatTestMaturité,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('sur requête PUT', () => {
    it('refuse la mise à jour si le résultat de test a déjà été revendiqué par un autre utilisateur', async () => {
      const resultatDeHector = await unRésultatDeTestDeMaturité().avecId('r1').pour(hectorDurant).construis();
      await entrepôtRésultatTestMaturité.ajoute(resultatDeHector);

      const reponse = await request(serveur).put('/api/resultats-test/r1').set('Cookie', [cookieJeanneDupont]).send();

      expect(reponse.status).toBe(HttpStatusCode.Forbidden);
      const resultatTest = await entrepôtRésultatTestMaturité.parId('r1');
      expect(resultatTest!.utilisateur).toBe(hectorDurant);
      busEvenements.naPasRecuDEvenement(ProprieteTestRevendiquee);
    });

    it('ne fait rien si le résultat a déjà été revendiqué par cet utilisateur', async () => {
      const resultatDeJeanne = await unRésultatDeTestDeMaturité().avecId('r1').pour(jeanneDupont).construis();
      await entrepôtRésultatTestMaturité.ajoute(resultatDeJeanne);

      const reponse = await request(serveur).put('/api/resultats-test/r1').set('Cookie', [cookieJeanneDupont]).send();

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      busEvenements.naPasRecuDEvenement(ProprieteTestRevendiquee);
    });

    it("associe l'utilisateur courant au résultat de test", async () => {
      await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().avecId('r1').construis());

      const reponse = await request(serveur).put('/api/resultats-test/r1').set('Cookie', [cookieJeanneDupont]).send();

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      const resultatTest = await entrepôtRésultatTestMaturité.parId('r1');
      expect(resultatTest!.utilisateur).toBe(jeanneDupont);
    });

    it("renvoie une erreur 404 lorsque le résultat de test n'existe pas", async () => {
      const reponse = await request(serveur).put('/api/resultats-test/r1').set('Cookie', [cookieJeanneDupont]).send();

      expect(reponse.status).toBe(HttpStatusCode.NotFound);
    });

    it('publie un événement de revendication de propriété du test', async () => {
      await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().avecId('r1').construis());

      await request(serveur).put('/api/resultats-test/r1').set('Cookie', [cookieJeanneDupont]).send();

      busEvenements.aRecuUnEvenement(ProprieteTestRevendiquee);
      const evenement = busEvenements.recupereEvenement(ProprieteTestRevendiquee);
      expect(evenement!.utilisateur).toBe(jeanneDupont);
      expect(evenement!.idResultatTest).toBe('r1');
    });

    it('refuse les requêtes non connectées', async () => {
      const reponse = await request(serveur).put('/api/resultats-test/r1').set('Cookie', []).send();

      expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
    });
  });
});
