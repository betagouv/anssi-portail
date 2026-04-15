<script lang="ts">
  import axios from 'axios';
  import type { IdItem } from '../catalogue/Catalogue.types';
  import { favorisStore } from '../stores/favoris.store';
  import { profilStore } from '../stores/profil.store';

  export let idItem: IdItem;
  export let avecBordure: boolean = false;

  $: estFavori = $favorisStore.includes(idItem);

  $: cheminIcone = `/assets/images/icone-favori-${estFavori ? 'plein' : 'vide'}.svg`;

  $: titre = $profilStore ? '' : 'Connectez-vous pour profiter des favoris';

  const actionSurClick = async () => {
    const idFavori = idItem;
    if (!$profilStore) return;

    try {
      if (estFavori) {
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

<button on:click|preventDefault={actionSurClick} title={titre} class:actif={$profilStore} class:bordure={avecBordure}>
  <img src={cheminIcone} alt="Favori" />
</button>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  button {
    background: transparent;
    cursor: pointer;
    border: none;
    min-width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    transition: transform 0.2s ease-in-out;
    pointer-events: initial;

    &.bordure {
      border: 1px solid var(--border-default-grey);
      border-radius: 8px;

      &:hover {
        background-color: var(--background-default-grey-hover);
      }
    }

    &.actif:hover:not(.bordure) {
      transform: scale(1.3);
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
</style>
