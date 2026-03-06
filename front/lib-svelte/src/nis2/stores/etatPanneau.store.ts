import { writable } from 'svelte/store';

export const etatPanneau = writable({
  menuComparaisonAffiche: false,
  menuFiltresAffiche: false,
});
