import { hydrate } from 'svelte';
import Page from './protection/entreprises/PresentationEntreprises.svelte';

hydrate(Page, {
  target: document.getElementById('entreprises')!,
});
