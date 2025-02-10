import { describe, expect, it } from "vitest";
import { get } from "svelte/store";
import { catalogueStore } from "../../../src/catalogue/stores/catalogue.store";
import { livretEnJeux, mss } from "./objetsExemples";

describe("Le store du catalogue", () => {
  it("est une collection d'items", () => {
    const store = get(catalogueStore);

    expect(store.length).toBe(0);
  });

  it("peut être initialisé avec des services", () => {
    catalogueStore.initialise([mss()]);

    expect(get(catalogueStore).length).toBe(1);
    expect(get(catalogueStore)[0].nom).toBe("mss");
  });

  it("peut être initialisé avec des ressources", () => {
    catalogueStore.initialise( [livretEnJeux()]);

    expect(get(catalogueStore).length).toBe(1);
    expect(get(catalogueStore)[0].nom).toBe("enjeux");
  });
});
