import assert from 'assert';
import { Request, Response } from 'express';
import { beforeEach, describe, it } from 'node:test';
import { fabriqueAttributionParcours } from '../../../src/api/middlewares/attributionParcours.js';
import { ParcoursRejoint } from '../../../src/bus/evenements/parcoursRejoint.js';
import { MockBusEvenement, fabriqueBusPourLesTests } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { ConstructeurDUtilisateur } from '../mesures/constructeurDUtilisateur.js';
import { ParcoursChangé } from '../../../src/bus/evenements/parcoursChange.js';

describe("Le middleware d'attribution de parcours", () => {
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;
  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();

    busEvenements = fabriqueBusPourLesTests();
  });
  describe("lorsque l'utilisateur n'a pas de parcours", () => {
    it('le rattache à un parcours', async () => {
      const utilisateur = new ConstructeurDUtilisateur().avecLEmail('chuck@yopmail.com').construis();
      await entrepotUtilisateur.ajoute(utilisateur);
      const attributionParcours = fabriqueAttributionParcours({ entrepotUtilisateur, busEvenements });
      let suiteEstAppellé = false;
      const requête = {
        originalUrl: '/parcours-complet',
        query: {
          mtm_campaign: 'campagne_2026_NA',
          pageSource: 'landing-parcours-securisation-bandeau',
        },
        utilisateur,
      } as Partial<Request>;

      await attributionParcours('complet')(requête as Request, {} as Response, () => {
        suiteEstAppellé = true;
      });

      const utilisateurMitÀJour = await entrepotUtilisateur.parEmailHache(utilisateur.emailHache());

      const evenement = busEvenements.recupereEvenement(ParcoursRejoint);
      assert.equal(utilisateurMitÀJour?.parcoursActuel(), 'complet');
      assert.equal(evenement?.emailHache, 'chuck@yopmail.com-hache');
      assert.equal(evenement?.parcours, 'complet');
      assert.equal(evenement?.motif, 'visite-page-module');
      assert.equal(evenement?.suivi?.campagne, 'campagne_2026_NA');
      assert.equal(evenement?.suivi?.source, 'landing-parcours-securisation-bandeau');
      assert.equal(suiteEstAppellé, true);
    });
  });

  describe("Lorsque l'utilisateur à déjà un parcours", () => {
    it("sait gérer l'absence de données de suivi", async () => {
      const utilisateur = new ConstructeurDUtilisateur()
        .avecLEmail('chuck@yopmail.com')
        .avecLeParcours('allégé')
        .construis();
      await entrepotUtilisateur.ajoute(utilisateur);
      const attributionParcours = fabriqueAttributionParcours({ entrepotUtilisateur, busEvenements });
      const requête = {
        originalUrl: '/parcours-complet',
        utilisateur,
        query: {},
      } as Partial<Request>;

      await attributionParcours('complet')(requête as Request, {} as Response, () => {});

      const evenement = busEvenements.recupereEvenement(ParcoursChangé);

      assert.equal(evenement?.suivi, undefined);
    });
    it('le change de parcours', async () => {
      const utilisateur = new ConstructeurDUtilisateur()
        .avecLEmail('chuck@yopmail.com')
        .avecLeParcours('allégé')
        .construis();
      await entrepotUtilisateur.ajoute(utilisateur);
      const attributionParcours = fabriqueAttributionParcours({ entrepotUtilisateur, busEvenements });
      let suiteEstAppellé = false;
      const requête = {
        originalUrl: '/parcours-complet',
        utilisateur,
        query: {
          campagne: 'campagne_2026_NA',
          pageSource: 'landing-parcours-securisation-bandeau',
        },
      } as Partial<Request>;

      await attributionParcours('complet')(requête as Request, {} as Response, () => {
        suiteEstAppellé = true;
      });

      const utilisateurMitÀJour = await entrepotUtilisateur.parEmailHache(utilisateur.emailHache());

      const evenement = busEvenements.recupereEvenement(ParcoursChangé);
      assert.equal(utilisateurMitÀJour?.parcoursActuel(), 'complet');
      assert.equal(evenement?.emailHache, 'chuck@yopmail.com-hache');
      assert.equal(evenement?.parcours, 'complet');
      assert.equal(evenement?.motif, 'visite-page-module');
      assert.equal(evenement?.suivi?.campagne, 'campagne_2026_NA');
      assert.equal(evenement?.suivi?.source, 'landing-parcours-securisation-bandeau');
      assert.equal(suiteEstAppellé, true);
    });
  });
});
