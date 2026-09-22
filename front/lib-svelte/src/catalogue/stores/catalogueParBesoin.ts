import { derived } from 'svelte/store';
import { BesoinCyber } from '../Catalogue.types';
import { catalogueStore } from './catalogue.store';
import { rechercheParBesoin } from './rechercheParBesoin.store';

export const catalogueParBesoin = derived(
  [catalogueStore, rechercheParBesoin],
  ([$catalogueStore, $rechercheParBesoin]) => {
    const besoinCyber = $rechercheParBesoin ? $rechercheParBesoin : BesoinCyber.TOUS;
    return $catalogueStore.repartition[besoinCyber]
      .map((id) => $catalogueStore.items.find((i) => i.id === id))
      .filter((i) => i !== undefined);
  }
);
