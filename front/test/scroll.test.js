import { describe, expect, test } from 'vitest';
import { elementLePlusVisible, ratioEspaceOccupe } from '../scripts/scroll';

describe('Pour la synchronisation avec le scroll', () => {
  describe("le calcul de visibilite d'un element", () => {
    const etat = (top, hauteur) => ({ top, hauteur, hauteurFenetre: 100 });

    test("retourne 0 lorsque l'element est au-dessus", () => {
      const ratio = ratioEspaceOccupe(etat(-100, 10));

      expect(ratio).toBe(0);
    });

    test("retourne 0.5 lorsque l'element occupe la moitie superieure de la fenetre", () => {
      const ratio = ratioEspaceOccupe(etat(0, 50));

      expect(ratio).toBe(0.5);
    });

    test("retourne 0 lorsque l'element est au-dessous de la fenetre", () => {
      const ratio = ratioEspaceOccupe(etat(200, 50));

      expect(ratio).toBe(0);
    });

    test("retourne la proportion visible lorsque l'element depasse par en-dessous", () => {
      const ratio = ratioEspaceOccupe(etat(0, 250));

      expect(ratio).toBe(1);
    });

    test("retourne la proportion visible lorsque l'element depasse par au-dessus et occupe tout l'espace", () => {
      const ratio = ratioEspaceOccupe(etat(-50, 150));

      expect(ratio).toBe(1);
    });

    test("retourne la proportion visible lorsque l'element depasse par au-dessus et n'occupe pas tout l'espace", () => {
      const ratio = ratioEspaceOccupe(etat(-50, 100));

      expect(ratio).toBe(0.5);
    });

    test("retourne la proportion visible lorsque l'element depasse par en-dessous et n'occupe pas tout l'espace", () => {
      const ratio = ratioEspaceOccupe(etat(60, 100));

      expect(ratio).toBe(0.4);
    });
  });

  describe("le calcul de l'élément le plus visible", () => {
    test("renvoie l'élément qui occupe le plus d'espace", () => {
      const fenetre = 100;
      const mini = { getBoundingClientRect: () => ({ top: 0, height: 30 }) };
      const maxi = { getBoundingClientRect: () => ({ top: 30, height: 70 }) };

      const lePlusVisible = elementLePlusVisible([mini, maxi], fenetre);

      expect(lePlusVisible).toEqual(maxi);
    });

    test('renvoie null si tous les éléments sont invisibles', () => {
      const fenetre = 100;
      const invisible1 = {
        getBoundingClientRect: () => ({ top: -100, height: 20 }),
      };
      const invisible2 = {
        getBoundingClientRect: () => ({ top: -80, height: 40 }),
      };

      const lePlusVisible = elementLePlusVisible(
        [invisible1, invisible2],
        fenetre
      );

      expect(lePlusVisible).toBe(null);
    });
  });
});
