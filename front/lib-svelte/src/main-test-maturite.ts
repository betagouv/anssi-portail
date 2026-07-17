import { hydrate } from 'svelte';
import TestMaturite from './test-maturite/TestMaturite.svelte';

hydrate(TestMaturite, {
  target: document.getElementById('test-maturite')!,
});
