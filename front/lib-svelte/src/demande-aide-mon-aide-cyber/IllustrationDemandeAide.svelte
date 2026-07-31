<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  let satisfaction = $state<number>();

  onMount(async () => {
    const reponse = await axios.get<{
      organisationsAccompagnees: number;
      satisfaction: number;
    }>(`/api/diagnostic/statistiques`);

    satisfaction = reponse.data.satisfaction;
  });
</script>

<div class="composition">
  <img src="/assets/images/homme-regardant-webinaire.avif" alt="Homme regardant un webinaire" />

  <div class="legende-illustree">
    <div class="illustration">
      <lab-anssi-icone nom="thumb-up-fill" taille="sm"></lab-anssi-icone>
    </div>
    <div class="legende">
      <p class="texte-detail-sm">{satisfaction}% sont satisfaites</p>
    </div>
  </div>
</div>

<style lang="scss">
  .composition {
    aspect-ratio: 4 / 3;
    display: flex;
    justify-content: center;
    position: relative;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    .legende-illustree {
      position: absolute;
      display: inline-flex;
      gap: 0.375rem;
      align-items: center;
      bottom: 42px;
      left: 0;

      .illustration {
        color: var(--text-title-blue-france);
        background-color: var(--background-default-grey);
        padding: 7px 0.75rem 9px;
        border-radius: 999px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      }
      .legende {
        background-color: var(--background-default-grey);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

        .texte-detail-sm {
          margin: 0;
        }
      }
    }
  }
</style>
