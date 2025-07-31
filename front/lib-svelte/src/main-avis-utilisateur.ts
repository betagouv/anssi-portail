import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';

mount(AvisUtilisateur, {
  target: document.getElementById('avis-utilisateur')!,
});
