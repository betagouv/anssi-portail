import { hydrate } from 'svelte';
import ParcoursReflexeCyber from './mini-tests/reflexe-cyber/moteur-de-jeu/ParcoursReflexeCyber.svelte';

hydrate(ParcoursReflexeCyber, {
  target: document.getElementById('mini-test-reflexe-cyber-parcours')!,
});
