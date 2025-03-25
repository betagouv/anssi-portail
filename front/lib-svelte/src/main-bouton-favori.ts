import { mount } from 'svelte';
import BoutonFavori from './favoris/BoutonFavori.svelte';
import { profilStore } from './stores/profil.store';

const idItemCyber = (
  document.getElementById(`script-bouton-favori`)!.attributes as {
    [key: string]: any;
  }
)['id-item-cyber'].value;

let boutonFavori;
if (profilStore) {
  boutonFavori = mount(BoutonFavori, {
    target: document.getElementById(`bouton-favori`)!,
    props: {
      idItemCyber,
    },
  });
}

export default boutonFavori;
