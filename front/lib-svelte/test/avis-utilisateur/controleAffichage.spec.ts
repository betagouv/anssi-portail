import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  afficheAvisUtilisateur,
  calculeDelaiRestantAvisUtilisateur,
  proposeAvisUtilisteur,
} from '../../src/avis-utilisateur/controleAffichage';

describe("La demande d'avis utilisateur", () => {
  const dateCourante = new Date(2025, 7, 15, 12, 0, 0);
  const uneJourneeEnMilliseconde = 1000 * 60 * 60 * 24;
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(dateCourante);
  });
  afterAll(() => {
    vi.restoreAllMocks();
  });
  describe("n'est pas proposé", () => {
    it("quand l'utilisateur a déjà rempli un avis", () => {
      const affichage = proposeAvisUtilisteur({
        dateDernierAvis: new Date(2025, 7, 15),
      });

      expect(affichage).toBeFalsy();
    });

    it("quand l'utilisateur a fermé le CTA ou la dialogue il y a moins de 24 heures", () => {
      const affichage = proposeAvisUtilisteur({
        dateDerniereFermeture: new Date(
          dateCourante.getTime() - uneJourneeEnMilliseconde
        ),
      });

      expect(affichage).toBeFalsy();
    });
  });

  describe('est proposé', () => {
    it("quand l'utilisateur n'a jamais rempli un avis", () => {
      const affichage = proposeAvisUtilisteur({});

      expect(affichage).toBeTruthy();
    });

    it("quand l'utilisateur a fermé le CTA ou la dialogue il y a plus de 24 heures", () => {
      const affichage = proposeAvisUtilisteur({
        dateDerniereFermeture: new Date(
          dateCourante.getTime() - uneJourneeEnMilliseconde - 1000
        ),
      });

      expect(affichage).toBeTruthy();
    });
  });
});

describe("L'affichage de l'avis utilisateur", () => {
  it('est désactivé sur la page du cyberdépart', () => {
    const affichage = afficheAvisUtilisateur({
      cheminCourant: '/cyberdepart',
    });

    expect(affichage).toBeFalsy();
  });

  it('est désactivé sur la page du test de maturité', () => {
    const affichage = afficheAvisUtilisateur({
      cheminCourant: '/test-maturite',
    });

    expect(affichage).toBeFalsy();
  });

  it('est activé sur la page du cyberdépart', () => {
    const affichage = afficheAvisUtilisateur({
      cheminCourant: '/test-maturite/#votre-organisation',
    });

    expect(affichage).toBeTruthy();
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
