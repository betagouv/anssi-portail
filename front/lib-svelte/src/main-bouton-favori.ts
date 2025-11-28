import { mount } from 'svelte';
import BoutonFavori from './favoris/BoutonFavori.svelte';
import { profilStore } from './stores/profil.store';

const idItem = (
  document.getElementById(`script-bouton-favori`)!.attributes as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
)['id-item-cyber'].value;

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
