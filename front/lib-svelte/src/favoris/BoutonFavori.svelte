<script lang="ts">
  import axios from 'axios';

  export let surClic: () => string;
  export let estPlein: boolean;
  $: cheminIcone = `/assets/images/icone-favori-${estPlein ? 'plein' : 'vide'}.svg`;
  const actionSurClick = async () => {
    const idFavori = surClic();
    try {
      if (estPlein) {
        await axios.delete(`/api/favoris/${encodeURIComponent(idFavori)}`);
      } else {
        await axios.post('/api/favoris', {id: idFavori});
      }
      estPlein = !estPlein;
    } catch (error) {
      console.error("API indisponible", error);
    }
  };
</script>

<button on:click|preventDefault={actionSurClick}>
  <img src={cheminIcone} alt="Favori"/>
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

    &:hover {
      transform: scale(1.3);
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
</style>
