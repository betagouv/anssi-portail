import { mount } from 'svelte';
import Sante from './sante/Sante.svelte';

mount(Sante, {
  target: document.getElementById('sante')!,
});
