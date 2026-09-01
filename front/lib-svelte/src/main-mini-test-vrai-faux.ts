import { hydrate } from 'svelte';
import LandingVraiFaux from './mini-tests/LandingVraiFaux.svelte';

hydrate(LandingVraiFaux, {
  target: document.getElementById('mini-test-vrai-faux')!,
});
