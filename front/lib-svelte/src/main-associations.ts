import { hydrate } from 'svelte';
import Page from './protection/associations/PresentationAssociations.svelte';

hydrate(Page, {
  target: document.getElementById('associations')!,
});
