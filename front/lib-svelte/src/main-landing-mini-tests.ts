import { hydrate } from 'svelte';
import LandingTests from './mini-tests/LandingMiniTests.svelte';

hydrate(LandingTests, {
  target: document.getElementById('landing-mini-tests')!,
});
