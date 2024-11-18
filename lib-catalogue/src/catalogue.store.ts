import { writable } from "svelte/store";
import type { ItemCyber } from "./Catalogue.types";

const { subscribe, set } = writable([] as ItemCyber[]);

export const catalogueStore = {
  subscribe,
  initialise: (services: ItemCyber[], ressources: ItemCyber[]) =>
    set([...services, ...ressources]),
};
