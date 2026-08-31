<script lang="ts">
  import { onMount } from 'svelte';
  import { récupèreStatistiquesMSC, type Statistiques } from '../passerelles/statistiquesMSC';

  type Props = {
    large?: boolean;
  };
  const { large }: Props = $props();

  let statistiques: Statistiques | undefined = $state();

  onMount(async () => {
    statistiques = await récupèreStatistiquesMSC();
  });
</script>

<div class="composition" class:large>
  <img
    class="illustration"
    src="/assets/images/groupe-regardant-test-maturite.avif"
    alt="Groupe regardant la présentation du test maturité"
  />
  <div class="annotation">
    <p class="fr-h5">+{statistiques?.diagnosticsCyberArrondis ?? 0}</p>
    <p class="texte-standard-md">organisations<br />accompagnées</p>
  </div>
  <div class="legende-illustree">
    <div class="illustration">
      <lab-anssi-icone nom="thumb-up-fill" taille="sm"></lab-anssi-icone>
    </div>
    <div class="legende">
      <p class="texte-detail-sm">{statistiques?.satisfactionUtilisateur ?? 0}% sont satisfaites</p>
    </div>
  </div>
  <div class="manette">
    <lab-anssi-icone nom="gamepad-fill" taille="lg"></lab-anssi-icone>
  </div>
  <img class="fleur" src="/assets/images/decorations/fleur.svg" alt="" />
  <img class="boucle" src="/assets/images/decorations/boucle.svg" alt="" />
  <img class="ellipse" src="/assets/images/decorations/ellipse.svg" alt="" />
</div>

<style lang="scss">
  .composition {
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    position: relative;

    > .illustration {
      border-radius: 12px;
      height: 100%;
      width: 70%;
      object-fit: cover;
    }

    &.large {
      aspect-ratio: 70 / 39;

      .annotation,
      .legende-illustree,
      .legende,
      .manette,
      .fleur,
      .boucle,
      .ellipse {
        transform: scale(90%);
      }

      .manette {
        right: 50px;
      }
    }

    .legende-illustree {
      position: absolute;
      display: inline-flex;
      gap: 0.375rem;
      align-items: center;
      bottom: 18px;
      left: 0;

      .illustration {
        color: var(--text-title-blue-france);
        background-color: var(--background-default-grey);
        flex: 0;
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

    .manette {
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
      color: var(--text-title-blue-france);
      height: 12px;
      left: 8%;
      position: absolute;
      top: 4%;
      width: 12px;
    }

    .boucle {
      bottom: 12%;
      color: var(--text-title-blue-france);
      position: absolute;
      right: 6%;
      width: 140px;
    }

    .ellipse {
      bottom: calc(12% + 100px);
      position: absolute;
      right: 10%;
      width: 10px;
    }
  }
</style>
