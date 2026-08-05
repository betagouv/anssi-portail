import { hydrate } from 'svelte';
import Page from './parcours-securisation/LandingParcoursCyberdepart.svelte';

hydrate(Page, {
  target: document.getElementById('parcours-cyberdepart')!,
});
