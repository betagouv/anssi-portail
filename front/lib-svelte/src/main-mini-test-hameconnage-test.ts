import { hydrate } from 'svelte';
import TestHameconnage from './mini-tests/hameconnage/TestHameconnage.svelte';

hydrate(TestHameconnage, {
  target: document.getElementById('mini-test-hameconnage-test')!,
});
