import { writable } from "svelte/store";
import type { ItemCyber } from "../Catalogue.types";

const { subscribe, set } = writable([] as ItemCyber[]);

export const catalogueStore = {
  subscribe,
  initialise: (itemsCyber: ItemCyber[]) => set([...itemsCyber]),
};
