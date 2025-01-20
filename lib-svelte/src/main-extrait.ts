import { mount } from "svelte";
import ExtraitItems from "./ExtraitItems.svelte";
import type {ItemCyber} from "./Catalogue.types";
import {catalogueStore} from "./stores/catalogue.store";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const { ressources, services } = JSON.parse(donnees) as {
  services: ItemCyber[];
  ressources: ItemCyber[];
};

catalogueStore.initialise(services, ressources);

const extrait = mount(ExtraitItems, {
  target: document.getElementById("extrait")!,
});

export default extrait;
