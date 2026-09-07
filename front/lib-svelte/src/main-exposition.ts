import { hydrate } from 'svelte';
import ExpositionCyberattaques from './mini-tests/exposition/ExpositionCyberattaques.svelte';

hydrate(ExpositionCyberattaques, {
  target: document.getElementById('exposition')!,
});
