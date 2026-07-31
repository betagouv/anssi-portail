<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  let satisfaction = $state<number>();
  let nombreOrganisations = $state<number>();

  onMount(async () => {
    const reponse = await axios.get<{
      organisationsAccompagnees: number;
      satisfaction: number;
    }>(`/api/diagnostic/statistiques`);
    nombreOrganisations = reponse.data.organisationsAccompagnees;
    satisfaction = reponse.data.satisfaction;
  });
</script>

<div class="composition">
  <img src="/assets/images/homme-regardant-webinaire.avif" alt="Homme regardant un webinaire" />

  <div class="annotation">
    <p class="fr-h5">+{nombreOrganisations}</p>
    <p class="texte-standard-md">organisations<br />accompagnées</p>
  </div>
  <div class="legende-illustree">
    <div class="illustration">
      <lab-anssi-icone nom="thumb-up-fill" taille="sm"></lab-anssi-icone>
    </div>
    <div class="legende">
      <p class="texte-detail-sm">{satisfaction}% sont satisfaites</p>
    </div>
  </div>
  <div class="bouclier">
    <lab-anssi-icone nom="shield-fill" taille="lg"></lab-anssi-icone>
  </div>
  <div class="fleur">
    <img src="/assets/images/decorations/fleur.svg" alt="" />
  </div>
  <div class="boucle">
    <img src="/assets/images/decorations/boucle.svg" alt="" />

    <div class="ellipse">
      <img src="/assets/images/decorations/ellipse.svg" alt="" />
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
      bottom: 6%;
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

    .annotation {
      position: absolute;
      display: inline-flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
      left: 10px;
      top: calc(50% - 52px);
      padding: 0.75rem;
      border-radius: 8px;
      background-color: var(--background-default-grey);
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);

      p {
        margin: 0;
        &.fr-h5 {
          color: var(--text-title-blue-france);
        }
        &.texte-standard-md {
          font-weight: bold;
        }
      }
    }

    .bouclier {
      position: absolute;
      right: 8%;
      top: 4%;
      padding: 1rem;
      border-radius: 999px;
      background-color: var(--background-default-grey);
      color: var(--text-title-blue-france);
      box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    }

    .fleur {
      position: absolute;
      left: 8%;
      top: 4%;
      color: var(--text-title-blue-france);
      img {
        width: 12px;
        height: 12px;
      }
    }

    .boucle {
      position: absolute;
      right: 6%;
      bottom: 12%;
      color: var(--text-title-blue-france);
      img {
        width: 140px;
      }

      .ellipse {
        position: absolute;
        right: 15%;
        bottom: 110%;

        img {
          width: 10px;
        }
      }
    }
  }
</style>
