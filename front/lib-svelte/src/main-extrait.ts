import { mount } from "svelte";
import ExtraitItems from "./catalogue/ExtraitItems.svelte";
import type { ItemCyber, RepartitionParBesoin } from "./catalogue/Catalogue.types";
import { catalogueStore } from "./catalogue/stores/catalogue.store";

const donnees = document.getElementById("donnees")!.textContent;
if (!donnees) throw new Error("Impossible de trouver les données du catalogue");

const { itemsCyber, repartition } = JSON.parse(donnees) as {
  itemsCyber: ItemCyber[];
  repartition: RepartitionParBesoin;
};

catalogueStore.initialise(itemsCyber, repartition);

 mount(ExtraitItems, {
   target: document.getElementById('extrait')!,
 });
