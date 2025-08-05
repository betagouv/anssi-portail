import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  calculeDelaiRestantAvisUtilisateur,
  proposeAvisUtilisteur,
} from '../../src/avis-utilisateur/controleAffichage';

describe("Le controle de l'affichage de la demande d'avis utilisateur", () => {
  describe('doit controler le chemin courant', () => {
    it("et empêcher l'affichage sur la page du cyberdépart", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/cyberdepart',
      });

      expect(affichage).toBeFalsy();
    });

    it("et empêcher l'affichage sur la page du test de maturité", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/test-maturite',
      });

      expect(affichage).toBeFalsy();
    });

    it("et autoriser l'affichage sur la page du cyberdépart", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/test-maturite/#votre-organisation',
      });

      expect(affichage).toBeTruthy();
    });
  });

  describe("doit controler si l'utilisateur a déjà rempli un avis", () => {
    it("et empêcher l'affichage si c'est le cas", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/',
        dateDernierAvis: new Date(2025, 7, 15),
      });

      expect(affichage).toBeFalsy();
    });

    it("et autoriser l'affichage si ce n'est pas le cas", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/',
      });

      expect(affichage).toBeTruthy();
    });
  });

  describe("doit controler si l'utilisateur a récemment fermé la demande d'avis", () => {
    const dateCourante = new Date(2025, 7, 15, 12, 0, 0);
    const uneJourneeEnMilliseconde = 1000 * 60 * 60 * 24;
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(dateCourante);
    });
    afterAll(() => {
      vi.restoreAllMocks();
    });
    it("et empêcher l'affichage quand ça date de moins de 24 heures", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/',
        dateDerniereFermeture: new Date(
          dateCourante.getTime() - uneJourneeEnMilliseconde
        ),
      });

      expect(affichage).toBeFalsy();
    });

    it("et autoriser l'affichage quand ça date de plus de 24 heures", () => {
      const affichage = proposeAvisUtilisteur({
        cheminCourant: '/',
        dateDerniereFermeture: new Date(
          dateCourante.getTime() - uneJourneeEnMilliseconde - 1000
        ),
      });

      expect(affichage).toBeTruthy();
    });
  });
});

describe("Le calcul du délai d'affichage de la demande d'avis", () => {
  const dateCourante = new Date(2025, 7, 15, 12, 0, 0);
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(dateCourante);
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  it('se base sur la date de première visite et la durée minimum', () => {
    const dureeMinimumEnSecondes = 20;
    const datePremierVisite = new Date(2025, 7, 15, 11, 59, 55);

    const delai = calculeDelaiRestantAvisUtilisateur({
      dureeMinimumEnSecondes,
      datePremiereVisite: datePremierVisite,
    });

    expect(delai).toEqual(15);
  });

  it("se base uniquement sur la durée minimum si il n'y a pas de date de première visite", () => {
    const dureeMinimumEnSecondes = 20;

    const delai = calculeDelaiRestantAvisUtilisateur({
      dureeMinimumEnSecondes,
    });

    expect(delai).toEqual(20);
  });
});
