import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';

const donnees = document.getElementById('donneesAvisUtilisateur')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const props = JSON.parse(donnees);

mount(AvisUtilisateur, {
  target: document.getElementById('avis-utilisateur')!,
  props,
});
