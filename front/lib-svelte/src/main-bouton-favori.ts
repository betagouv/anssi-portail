import { mount } from 'svelte';
import BoutonFavori from './favoris/BoutonFavori.svelte';
import { profilStore } from './stores/profil.store';

const donnees = document.getElementById('donneesBoutonFavoris')!.textContent;
if (!donnees) throw new Error('Impossible de trouver les données');

const { idItem } = JSON.parse(donnees);

let boutonFavori;
if (profilStore) {
  boutonFavori = mount(BoutonFavori, {
    target: document.getElementById(`bouton-favori`)!,
    props: {
      idItem,
    },
  });
}

export default boutonFavori;
