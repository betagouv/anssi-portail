import { writable } from "svelte/store";
import { ThemeCyber } from "../Catalogue.types";

const selectionThemes = writable<ThemeCyber[]>([]);

export const rechercheParTheme = {
  subscribe: selectionThemes.subscribe,
  set: selectionThemes.set,
};
