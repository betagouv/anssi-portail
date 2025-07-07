import { mount } from 'svelte';
import Statistiques from './statistiques/Statistiques.svelte';

mount(Statistiques, {
  target: document.getElementById('statistiques')!,
});
