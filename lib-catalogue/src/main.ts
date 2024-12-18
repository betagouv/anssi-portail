import { mount } from "svelte";
import Catalogue from "./Catalogue.svelte";
import type { ItemCyber } from "./Catalogue.types";
import { catalogueStore } from "./stores/catalogue.store";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const { ressources, services } = JSON.parse(donnees) as {
  services: ItemCyber[];
  ressources: ItemCyber[];
};

catalogueStore.initialise(services, ressources);

const catalogue = mount(Catalogue, {
  target: document.getElementById("catalogue")!,
});

export default catalogue;
