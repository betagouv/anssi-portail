import { get, writable } from "svelte/store";
import { type ItemCyber, Source } from "../Catalogue.types";

const selectionDeSources = writable<Source[]>([]);

export const rechercheParSource = {
  subscribe: selectionDeSources.subscribe,
  set: selectionDeSources.set,
  ajoute: (source: Source) => {
    /* On fait ce test pour éviter d’appeler update si ce n’est pas nécessaire.
       En effet, chaque appel à update va déclencher une boucle infinie de mise à jour pour les obervateurs,
       ce qui provoque une erreur `effect_update_depth_exceeded` lorsque le composant FiltreSource est utilisé
       plusieurs fois.  */
    if (!get(selectionDeSources).includes(source)) {
      selectionDeSources.update((etatActuel) => [
        ...new Set([...etatActuel, source]),
      ]);
    }
  },
  retire: (source: Source) => {
    // cf commentaire sur l’ajout
    if (get(selectionDeSources).includes(source)) {
      selectionDeSources.update((valeur) => valeur.filter((v) => v !== source));
    }
  },
  reinitialise: () => selectionDeSources.set([]),
  ok: (item: ItemCyber) => {
    const sources = get(rechercheParSource);
    if (sources.length === 0) return true;
    if (!item.sources) return false;
    if (item.sources.includes(Source.ANSSI)) {
      if (!sources.includes(Source.ANSSI)) {
        return false;
      }
      const secondaire = item.sources.find((s) => s !== Source.ANSSI);
      if (secondaire) {
        return sources.includes(secondaire as Source);
      }
      return false;
    }
    return sources.includes(Source.PARTENAIRES);
  },
};
