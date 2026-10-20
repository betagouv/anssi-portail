import { hydrate } from 'svelte';
import LandingHameconnage from './mini-tests/hameconnage/LandingHameconnage.svelte';

hydrate(LandingHameconnage, {
  target: document.getElementById('mini-test-hameconnage')!,
});
