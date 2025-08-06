import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  ControleAvisUtilisateur,
  type EntrepotAvisUtilisateur,
} from '../../src/avis-utilisateur/ControleAvisUtilisateur';

describe("Controle la demande d'avis utilisateur", () => {
  const fauxEntrepotAvisUtilisateur: EntrepotAvisUtilisateur = {
    dateDebutSession: () => undefined,
    dateDerniereFermetureAvis: () => undefined,
    dateDernierAvis: () => undefined,
    modifieDateDebutSession: () => {},
  };

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 7, 15, 12, 0, 0));
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('et ne la propose pas', () => {
    it("quand l'utilisateur a déjà rempli un avis", () => {
      const controle = new ControleAvisUtilisateur({
        entrepotAvisUtilisateur: {
          ...fauxEntrepotAvisUtilisateur,
          dateDernierAvis: () => new Date(2025, 6, 15, 12, 0, 0),
        },
      });

      const avisEstPropose = controle.proposeAvisUtilisteur();

      expect(avisEstPropose).toBeFalsy();
    });

    it("quand l'utilisateur a fermé le CTA ou la dialogue il y a moins de 24 heures", () => {
      const controle = new ControleAvisUtilisateur({
        entrepotAvisUtilisateur: {
          ...fauxEntrepotAvisUtilisateur,
          dateDerniereFermetureAvis: () => new Date(2025, 7, 14, 12, 0, 0),
        },
      });

      const avisEstPropose = controle.proposeAvisUtilisteur();

      expect(avisEstPropose).toBeFalsy();
    });
  });

  describe('et la propose', () => {
    it("quand l'utilisateur n'a jamais rempli un avis", () => {
      const controle = new ControleAvisUtilisateur({
        entrepotAvisUtilisateur: fauxEntrepotAvisUtilisateur,
      });

      const avisEstPropose = controle.proposeAvisUtilisteur();

      expect(avisEstPropose).toBeTruthy();
    });

    it("quand l'utilisateur a fermé le CTA ou la dialogue il y a plus de 24 heures", () => {
      const controle = new ControleAvisUtilisateur({
        entrepotAvisUtilisateur: {
          ...fauxEntrepotAvisUtilisateur,
          dateDerniereFermetureAvis: () => new Date(2025, 7, 14, 11, 59, 59),
        },
      });

      const avisEstPropose = controle.proposeAvisUtilisteur();

      expect(avisEstPropose).toBeTruthy();
    });
  });

  describe('retarde son affichage', () => {
    const dateCourante = new Date(2025, 7, 15, 12, 0, 0);
    beforeAll(() => {
      vi.useFakeTimers();
      vi.setSystemTime(dateCourante);
    });
    afterAll(() => {
      vi.restoreAllMocks();
    });
    it('en se basant sur la date de première visite et la durée minimum', () => {
      const controle = new ControleAvisUtilisateur({
        dureeMinimumEnSecondes: '20',
        entrepotAvisUtilisateur: {
          ...fauxEntrepotAvisUtilisateur,
          dateDebutSession: () => new Date(2025, 7, 15, 11, 59, 55),
        },
      });

      const delai = controle.calculeDelaiRestantAvisUtilisateur();

      expect(delai).toEqual(15);
    });

    it("en se basant uniquement sur la durée minimum si il n'y a pas de date de première visite", () => {
      const controle = new ControleAvisUtilisateur({
        dureeMinimumEnSecondes: '20',
        entrepotAvisUtilisateur: fauxEntrepotAvisUtilisateur,
      });

      const delai = controle.calculeDelaiRestantAvisUtilisateur();

      expect(delai).toEqual(20);
    });
  });
});
