import { hydrate } from 'svelte';
import Page from './parcours-securisation/LandingParcoursSecurisation.svelte';

hydrate(Page, {
  target: document.getElementById('parcours-securisation')!,
});
