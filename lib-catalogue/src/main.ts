import { mount } from "svelte";
import Catalogue from "./Catalogue.svelte";
import type { ItemCyber } from "./Catalogue.types";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const props = JSON.parse(donnees) as {
  services: ItemCyber[];
  ressources: ItemCyber[];
};

const catalogue = mount(Catalogue, {
  target: document.getElementById("catalogue")!,
  props,
});

export default catalogue;
