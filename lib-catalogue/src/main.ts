import { mount } from "svelte";
import Catalogue from "./Catalogue.svelte";
import type { Service } from "./Catalogue.types";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const props = JSON.parse(donnees) as { services: Service[] };

const catalogue = mount(Catalogue, {
  target: document.getElementById("catalogue")!,
  props,
});

export default catalogue;
