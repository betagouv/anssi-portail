import { hydrate } from 'svelte';
import ConseilsCyber from './conseils-cyber/ConseilsCyber.svelte';

hydrate(ConseilsCyber, {
  target: document.getElementById('conseils-cyber')!,
});
