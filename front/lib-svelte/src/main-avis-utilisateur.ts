import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';
import { proposeAvisUtilisteur } from './avis-utilisateur/controleAffichage';

const donnees = document.getElementById('donneesAvisUtilisateur')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const { delaiAffichageAvisUtilisateur, ...props } = JSON.parse(donnees);

setTimeout(
  () => {
    const cheminCourant = window.location.pathname;
    const dateDernierAvisEnregistree = new Date(
      localStorage.getItem('dateDernierAvis') ?? ''
    );
    const dateDernierAvis = isNaN(dateDernierAvisEnregistree.getTime())
      ? undefined
      : dateDernierAvisEnregistree;

    const dateDerniereFermetureEnregistree = new Date(
      localStorage.getItem('dateDerniereFermeture') ?? ''
    );
    const dateDerniereFermeture = isNaN(
      dateDerniereFermetureEnregistree.getTime()
    )
      ? undefined
      : dateDerniereFermetureEnregistree;
    if (
      proposeAvisUtilisteur({
        cheminCourant,
        dateDernierAvis,
        dateDerniereFermeture,
      })
    ) {
      mount(AvisUtilisateur, {
        target: document.getElementById('avis-utilisateur')!,
        props,
      });
    }
  },
  (delaiAffichageAvisUtilisateur || 20) * 1000
);
