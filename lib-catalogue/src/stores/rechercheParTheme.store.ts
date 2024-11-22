import { get, writable } from "svelte/store";
import { type ItemCyber, ThemeCyber } from "../Catalogue.types";

const selectionThemes = writable<ThemeCyber[]>([]);

export const rechercheParTheme = {
  subscribe: selectionThemes.subscribe,
  set: selectionThemes.set,
  reinitialise: () => selectionThemes.set([]),
  ok: (item: ItemCyber) => {
    if (get(rechercheParTheme).length === 0) return true;
    if (!item.themes) return false;
    return !!get(rechercheParTheme).find((theme) =>
      item.themes.includes(theme),
    );
  },
};
