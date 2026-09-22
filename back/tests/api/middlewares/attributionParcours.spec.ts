import { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fabriqueAttributionParcours } from '../../../src/api/middlewares/attributionParcours.js';
import { ParcoursChangé } from '../../../src/bus/evenements/parcoursChange.js';
import { ParcoursRejoint } from '../../../src/bus/evenements/parcoursRejoint.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { ConstructeurDUtilisateur } from '../mesures/constructeurDUtilisateur.js';

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
      const suite = vi.fn();
      const requête = {
        originalUrl: '/parcours-complet',
        query: {
          mtm_campaign: 'campagne_2026_NA',
          pageSource: 'landing-parcours-securisation-bandeau',
        },
        utilisateur,
      } as Partial<Request>;

      await attributionParcours('complet')(requête as Request, {} as Response, suite);

      const utilisateurMitÀJour = await entrepotUtilisateur.parEmailHache(utilisateur.emailHache());

      const evenement = busEvenements.recupereEvenement(ParcoursRejoint);
      expect(utilisateurMitÀJour?.parcoursActuel()).toBe('complet');
      expect(evenement?.email).toBe('chuck@yopmail.com');
      expect(evenement?.parcours).toBe('complet');
      expect(evenement?.motif).toBe('visite-page-module');
      expect(evenement?.suivi?.campagne).toBe('campagne_2026_NA');
      expect(evenement?.suivi?.source).toBe('landing-parcours-securisation-bandeau');
      expect(suite).toHaveBeenCalledOnce();
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

      expect(evenement?.suivi).toBeUndefined();
    });
    it('le change de parcours', async () => {
      const utilisateur = new ConstructeurDUtilisateur()
        .avecLEmail('chuck@yopmail.com')
        .avecLeParcours('allégé')
        .construis();
      await entrepotUtilisateur.ajoute(utilisateur);
      const attributionParcours = fabriqueAttributionParcours({ entrepotUtilisateur, busEvenements });
      const suite = vi.fn();
      const requête = {
        originalUrl: '/parcours-complet',
        utilisateur,
        query: {
          campagne: 'campagne_2026_NA',
          pageSource: 'landing-parcours-securisation-bandeau',
        },
      } as Partial<Request>;

      await attributionParcours('complet')(requête as Request, {} as Response, suite);

      const utilisateurMitÀJour = await entrepotUtilisateur.parEmailHache(utilisateur.emailHache());

      const evenement = busEvenements.recupereEvenement(ParcoursChangé);
      expect(utilisateurMitÀJour?.parcoursActuel()).toBe('complet');
      expect(evenement?.email).toBe('chuck@yopmail.com');
      expect(evenement?.parcours).toBe('complet');
      expect(evenement?.motif).toBe('visite-page-module');
      expect(evenement?.suivi?.campagne).toBe('campagne_2026_NA');
      expect(evenement?.suivi?.source).toBe('landing-parcours-securisation-bandeau');
      expect(suite).toHaveBeenCalledOnce();
    });
  });
});
