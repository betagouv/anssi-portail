import { hydrate } from 'svelte';
import Guide from './catalogue/guides/Guide.svelte';

hydrate(Guide, {
  target: document.getElementById('guide')!,
});
