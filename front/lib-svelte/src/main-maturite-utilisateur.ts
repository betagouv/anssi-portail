import { mount } from 'svelte';
import MaturiteUtilisateur from './test-maturite/MaturiteUtilisateur.svelte';

const maturiteUtilisateur = mount(MaturiteUtilisateur, {
  target: document.getElementById('maturite-utilisateur')!,
});

export default maturiteUtilisateur;
