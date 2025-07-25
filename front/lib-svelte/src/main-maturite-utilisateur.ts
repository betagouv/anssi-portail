import { mount } from 'svelte';
import MaturiteUtilisateur from './test-maturite/MaturiteUtilisateur.svelte';

const donnees = document.getElementById('donnees')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

mount(MaturiteUtilisateur, {
  target: document.getElementById('maturite-utilisateur')!,
  props
});
