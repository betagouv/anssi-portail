import { hydrate } from 'svelte';
import Financements from './financements/Financements.svelte';

hydrate(Financements, {
  target: document.getElementById('financements')!,
});
