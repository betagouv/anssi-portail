<script lang="ts">
  import axios from 'axios';
  import type { IdItemCyber } from '../catalogue/Catalogue.types';
  import { favorisStore } from '../stores/favoris.store';
  import { profilStore } from '../stores/profil.store';

  export let idItemCyber: IdItemCyber;

  $: cheminIcone = `/assets/images/icone-favori-${estFavori(idItemCyber) ? 'plein' : 'vide'}.svg`;

  const estFavori = (idItemCyber: IdItemCyber) =>
    $favorisStore.includes(idItemCyber);

  $: titre = $profilStore ? '' : 'Connectez-vous pour profiter des favoris';

  const actionSurClick = async () => {
    const idFavori = idItemCyber;
    if (!$profilStore) return;

    try {
      if (estFavori(idFavori)) {
        await axios.delete(`/api/favoris/${encodeURIComponent(idFavori)}`);
        favorisStore.retire(idFavori);
      } else {
        await axios.post('/api/favoris', { idItemCyber: idFavori });
        favorisStore.ajoute(idFavori);
      }
    } catch (error) {
      console.error('API indisponible', error);
    }
  };
</script>

<button
  on:click|preventDefault={actionSurClick}
  title={titre}
  class:actif={$profilStore}
>
  <img src={cheminIcone} alt="Favori" />
</button>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  button {
    background: transparent;
    cursor: pointer;
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    transition: transform 0.2s ease-in-out;
    pointer-events: initial;

    &.actif:hover {
      transform: scale(1.3);
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
</style>
