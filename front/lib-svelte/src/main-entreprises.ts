import { mount } from 'svelte';
import Page from './protection/entreprises/PresentationEntreprises.svelte';

mount(Page, {
  target: document.getElementById('page-entreprises')!,
});
