<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { NiveauMaturite } from '../niveaux-maturite/NiveauxMaturite.type';

  export let niveauCourant: NiveauMaturite;
  export let animeTuiles = true;
  export let defilementAutomatique = true;

  $: indexNiveauCourant = niveauxMaturite.indexOf(niveauCourant);

  const scrolleVersTuileCourante = () => {
    let elementCourant: HTMLDivElement | null = document.querySelector(
      '.tuile-niveau.courant'
    );
    elementCourant!.scrollIntoView({ block: 'center' });
  };

  const estPetitEcran = window.matchMedia('(max-width: 576px)').matches;
  const animation = !estPetitEcran && animeTuiles;

  if (defilementAutomatique) {
    afterUpdate(scrolleVersTuileCourante);
  }
</script>

<div class="tuiles-niveau" class:avec-animation={animation}>
  {#each niveauxMaturite as niveau, index (index)}
    <div
      class="tuile-niveau"
      class:actif={index < indexNiveauCourant}
      class:courant={index === indexNiveauCourant}
      class:inactif={index > indexNiveauCourant}
    >
      <img
        class="plante"
        src="/assets/images/test-maturite/niveaux/{niveau.id}.svg"
        alt="Niveau de maturité"
      />
      <img
        class="coche"
        alt=""
        src="/assets/images/coche-ronde{index > indexNiveauCourant
          ? '-inactive'
          : '-active'}.svg"
      />
      <span>{niveau.label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .tuiles-niveau {
    display: flex;
    gap: 24px;
    padding-top: 16px;
    padding-bottom: 32px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 1px;
    }

    .tuile-niveau {
      scroll-snap-align: center;

      border: 1px solid var(--border-default-grey);
      border-radius: 8px;
      padding: 16px;
      background: #f6f6f6;
      flex: 0 0 214px;
      width: 214px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      font-weight: bold;
      gap: 8px;
      position: relative;

      .plante {
        order: 3;
        z-index: 2;
      }

      .coche {
        order: 2;
      }

      span {
        order: 1;
      }

      &.inactif {
        img {
          filter: grayscale(100%);
        }
      }

      &.actif {
        background: white;
      }

      &.courant {
        border-color: transparent;
        border-radius: 0;
        background: #fff7db;

        &:after {
          content: '';
          display: block;
          position: absolute;
          top: -4px;
          bottom: -4px;
          left: -4px;
          right: -4px;
          border-radius: 8px;
          border: 3px solid var(--jaune-msc);
        }
      }

      &:before {
        content: '';
        position: absolute;
        z-index: 0;
        bottom: 94px;
        border: 2px solid #0d0c21;
        left: 0;
        right: 0;
      }
    }

    &.avec-animation {
      .tuile-niveau {
        opacity: 0;
        animation: apparition 0.8s;
        animation-fill-mode: forwards;

        &:nth-child(1) {
          animation-delay: 0.5s;
        }

        &:nth-child(2) {
          animation-delay: 1s;
        }

        &:nth-child(3) {
          animation-delay: 1.4s;
        }

        &:nth-child(4) {
          animation-delay: 1.8s;
        }

        &:nth-child(5) {
          animation-delay: 2.2s;
        }

        @keyframes apparition {
          from {
            opacity: 0;
          }
          to {
            opacity: 100;
          }
        }
      }
    }
  }
</style>
