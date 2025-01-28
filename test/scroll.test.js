import { describe, expect, test } from "vitest";
import { ratioEspaceOccupe } from "../scripts/scroll";

describe("le calcul de visibilite d'un element", () => {
  const etat = (top, hauteur) => ({ top, hauteur, hauteurFenetre: 100 });

  test("retourne 0 lorsque l'element est au-dessus", () => {
    let ratio = ratioEspaceOccupe(etat(-100, 10));

    expect(ratio).toBe(0);
  });

  test("retourne 0.5 lorsque l'element occupe la moitie superieure de la fenetre", () => {
    let ratio = ratioEspaceOccupe(etat(0, 50));

    expect(ratio).toBe(0.5);
  });

  test("retourne 0 lorsque l'element est au-dessous de la fenetre", () => {
    let ratio = ratioEspaceOccupe(etat(200, 50));

    expect(ratio).toBe(0);
  });

  test("retourne la proportion visible lorsque l'element depasse par en-dessous", () => {
    let ratio = ratioEspaceOccupe(etat(0, 250));

    expect(ratio).toBe(1);
  });

  test("retourne la proportion visible lorsque l'element depasse par au-dessus et occupe tout l'espace", () => {
    let ratio = ratioEspaceOccupe(etat(-50, 150));

    expect(ratio).toBe(1);
  });

  test("retourne la proportion visible lorsque l'element depasse par au-dessus et n'occupe pas tout l'espace", () => {
    let ratio = ratioEspaceOccupe(etat(-50, 100));

    expect(ratio).toBe(0.5);
  });

  test("retourne la proportion visible lorsque l'element depasse par en-dessous et n'occupe pas tout l'espace", () => {
    let ratio = ratioEspaceOccupe(etat(50, 100));

    expect(ratio).toBe(0.5);
  });
});
