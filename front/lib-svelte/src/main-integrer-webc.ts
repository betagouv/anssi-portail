import { hydrate } from 'svelte';
import IntégrerWebC from './integration-webc/IntegrerWebC.svelte';

hydrate(IntégrerWebC, {
  target: document.getElementById('integrer-webc')!,
});
