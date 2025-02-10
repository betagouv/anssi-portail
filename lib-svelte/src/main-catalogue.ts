import { mount } from "svelte";
import Catalogue from "./catalogue/Catalogue.svelte";
import type { ItemCyber } from "./catalogue/Catalogue.types";
import { catalogueStore } from "./catalogue/stores/catalogue.store";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const { itemsCyber } = JSON.parse(donnees) as { itemsCyber: ItemCyber[] };

catalogueStore.initialise(itemsCyber);

const catalogue = mount(Catalogue, {
  target: document.getElementById("catalogue")!,
});

export default catalogue;
