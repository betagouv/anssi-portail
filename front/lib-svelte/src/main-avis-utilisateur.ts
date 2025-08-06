import { mount } from 'svelte';
import AvisUtilisateur from './avis-utilisateur/AvisUtilisateur.svelte';
import {
  calculeDelaiRestantAvisUtilisateur,
  proposeAvisUtilisteur,
} from './avis-utilisateur/controleAffichage';

const donnees = document.getElementById('donneesAvisUtilisateur')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const { delaiAffichageAvisUtilisateur, ...props } = JSON.parse(donnees);

const extraitDateDepuisNavigateur = ({
  cle,
  storage,
}: {
  cle: string;
  storage: Storage;
}): Date | undefined => {
  const datePremiereVisiteEnregistree = new Date(storage.getItem(cle) ?? '');
  return isNaN(datePremiereVisiteEnregistree.getTime())
    ? undefined
    : datePremiereVisiteEnregistree;
};

const datePremiereVisite = extraitDateDepuisNavigateur({
  storage: sessionStorage,
  cle: 'datePremiereVisite',
});

if (!datePremiereVisite) {
  sessionStorage.setItem('datePremiereVisite', new Date().toUTCString());
  localStorage.setItem('datePremiereVisite', new Date().toUTCString());
}

const dateDernierAvis = extraitDateDepuisNavigateur({
  storage: localStorage,
  cle: 'dateDernierAvis',
});
const dateDerniereFermeture = extraitDateDepuisNavigateur({
  storage: localStorage,
  cle: 'dateDerniereFermeture',
});

if (
  proposeAvisUtilisteur({
    dateDernierAvis,
    dateDerniereFermeture,
  })
) {
  const delaiEnSecondes = calculeDelaiRestantAvisUtilisateur({
    dureeMinimumEnSecondes: delaiAffichageAvisUtilisateur
      ? Number(delaiAffichageAvisUtilisateur)
      : 20,
    datePremiereVisite,
  });

  setTimeout(() => {
    mount(AvisUtilisateur, {
      target: document.getElementById('avis-utilisateur')!,
      props,
    });
  }, delaiEnSecondes * 1000);
}
