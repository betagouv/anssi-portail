import { derived } from 'svelte/store';
import { favorisStore, type ListeFavoris } from '../../stores/favoris.store';
import type { ItemCyber } from '../Catalogue.types';
import type { Guide } from '../Guide.types';
import { catalogueStore } from './catalogue.store';
import { guidesStore } from './guides/guides.store';

export function listeItemsFavoris(
  listeFavoris: ListeFavoris,
  itemsDuCatalogue: ItemCyber[],
  guides: Guide[]
) {
  const listeFavorisCatalogue = itemsDuCatalogue.filter((item) =>
    listeFavoris.includes(item.id)
  );
  const listeFavorisGuide = guides.filter((item) =>
    listeFavoris.includes(item.id)
  );
  return [...listeFavorisCatalogue, ...listeFavorisGuide];
}

export const itemsCatalogueEnFavori = derived(
  [catalogueStore, guidesStore, favorisStore],
  ([$catalogueStore, $guidesStore, $favorisStore]) => {
    return listeItemsFavoris(
      $favorisStore,
      $catalogueStore.items,
      $guidesStore
    );
  }
);
