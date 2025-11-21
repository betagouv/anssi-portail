import { mount } from 'svelte';
import Guide from './catalogue/guides/Guide.svelte';

mount(Guide, {
  target: document.getElementById('guide')!,
});
