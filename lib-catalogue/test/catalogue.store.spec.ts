import {beforeEach, describe, expect, it} from "vitest";
import { get } from "svelte/store";
import { catalogueStore } from "../src/catalogue.store";
import { ItemCyber } from "../src/Catalogue.types";

describe("Le store du catalogue", () => {
  it("est une collection d'items", () => {
    const store = get(catalogueStore);

    expect(store.length).toBe(0);
  });

  it("peut être initialisé avec des services", () => {
    const mss: ItemCyber = {
      nom: "mss",
      description: "Pour sécuriser",
      illustration: "mss.png",
      lienInterne: "http://...",
      sources: [],
    };

    catalogueStore.initialise([mss], []);

    expect(get(catalogueStore).length).toBe(1);
    expect(get(catalogueStore)[0].nom).toBe("mss");
  });

  it("peut être initialisé avec des ressources", () => {
    const livretEnJeux: ItemCyber = {
      nom: "enjeux",
      description: "",
      illustration: "livret.png",
      lienInterne: "http://...",
      sources: [],
    };

    catalogueStore.initialise([], [livretEnJeux]);

    expect(get(catalogueStore).length).toBe(1);
    expect(get(catalogueStore)[0].nom).toBe("enjeux");
  });
});
