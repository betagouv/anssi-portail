import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';

const donnees = document.getElementById('donneesAvisUtilisateur')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const { delaiAffichageAvisUtilisateur, ...props } = JSON.parse(donnees);

setTimeout(() => {
  mount(AvisUtilisateur, {
    target: document.getElementById('avis-utilisateur')!,
    props,
  });
}, delaiAffichageAvisUtilisateur || 20000);
