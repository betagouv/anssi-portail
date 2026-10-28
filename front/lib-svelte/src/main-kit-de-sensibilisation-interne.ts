import { hydrate } from 'svelte';
import KitDeSensibilisationInterne from './outils/KitDeSensibilisationInterne.svelte';

hydrate(KitDeSensibilisationInterne, {
  target: document.getElementById('kit-de-sensibilisation-interne')!,
});
