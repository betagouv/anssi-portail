import { derived } from 'svelte/store';
import { catalogueStore } from './catalogue.store';
import { favorisStore } from '../../stores/favoris.store';

export const itemsCatalogueEnFavori = derived(
  [catalogueStore, favorisStore],
  ([$catalogueStore, $favorisStore]) => {
    return $catalogueStore.items.filter((item) =>
      $favorisStore.includes(item.id)
    );
  }
);
