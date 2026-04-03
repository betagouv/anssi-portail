import { mount } from 'svelte';
import GestionGuide from './gestion-guides/GestionGuide.svelte';

mount(GestionGuide, {
  target: document.getElementById('gestion-guides')!,
});
