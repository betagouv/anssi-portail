import { hydrate } from 'svelte';
import CampagneDeSensibilisation from './outils/campagne-de-sensibilisation/CampagneDeSensibilisation.svelte';

hydrate(CampagneDeSensibilisation, {
  target: document.getElementById('campagne-de-sensibilisation')!,
});
