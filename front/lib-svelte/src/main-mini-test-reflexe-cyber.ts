import { hydrate } from 'svelte';
import LandingReflexeCyber from './mini-tests/reflexe-cyber/LandingReflexeCyber.svelte';

hydrate(LandingReflexeCyber, {
  target: document.getElementById('mini-test-reflexe-cyber')!,
});
