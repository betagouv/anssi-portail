import { hydrate } from 'svelte';
import Page from './parcours-securisation/LandingParcoursSecurisationComplet.svelte';

hydrate(Page, {
  target: document.getElementById('parcours-securisation-complet')!,
});
