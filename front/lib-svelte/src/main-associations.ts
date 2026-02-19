import { mount } from 'svelte';
import Page from './protection/associations/PresentationAssociations.svelte';

mount(Page, {
  target: document.getElementById('page-associations')!,
});
