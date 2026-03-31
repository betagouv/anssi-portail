import { mount } from 'svelte';
import AjoutDocument from './gestion-guides/AjoutDocument.svelte';

mount(AjoutDocument, {
  target: document.getElementById('gestion-guides-ajout-document')!,
});
