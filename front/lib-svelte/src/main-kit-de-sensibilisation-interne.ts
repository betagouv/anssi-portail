import { hydrate } from 'svelte';
import KitDeSensibilisationInterne from './outils/kit-de-sensibilisation-interne/KitDeSensibilisationInterne.svelte';

hydrate(KitDeSensibilisationInterne, {
  target: document.getElementById('kit-de-sensibilisation-interne')!,
});
