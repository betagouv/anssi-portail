import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';
import {
  ControleAvisUtilisateur,
  EntrepotNavigateurAvisUtilisateur,
} from './avis-utilisateur/ControleAvisUtilisateur';

const donnees = document.getElementById('donneesAvisUtilisateur')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const { delaiAffichageAvisUtilisateur, ...props } = JSON.parse(donnees);

const controleAvisUtilisateur = new ControleAvisUtilisateur({
  dureeMinimumEnSecondes: delaiAffichageAvisUtilisateur,
  entrepotAvisUtilisateur: new EntrepotNavigateurAvisUtilisateur(),
});

if (controleAvisUtilisateur.proposeAvisUtilisteur()) {
  const delaiEnSecondes =
    controleAvisUtilisateur.calculeDelaiRestantAvisUtilisateur();

  setTimeout(() => {
    mount(AvisUtilisateur, {
      target: document.getElementById('avis-utilisateur')!,
      props,
    });
  }, delaiEnSecondes * 1000);
}
