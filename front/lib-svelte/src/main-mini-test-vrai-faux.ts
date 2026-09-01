import { hydrate } from 'svelte';
import LandingVraiFaux from './mini-tests/vrai-faux/LandingVraiFaux.svelte';

hydrate(LandingVraiFaux, {
  target: document.getElementById('mini-test-vrai-faux')!,
});
