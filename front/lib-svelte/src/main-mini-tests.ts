import { hydrate } from 'svelte';
import MiniTests from './mini-tests/MiniTests.svelte';

hydrate(MiniTests, {
  target: document.getElementById('mini-tests')!,
});
