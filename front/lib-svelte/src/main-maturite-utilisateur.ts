import { mount } from 'svelte';
import MaturiteUtilisateur from './test-maturite/MaturiteUtilisateur.svelte';

mount(MaturiteUtilisateur, {
  target: document.getElementById('maturite-utilisateur')!,
});
