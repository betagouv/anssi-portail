<script lang="ts">
  import { Tween } from 'svelte/motion';

  type Props = {
    actif: boolean;
    surDécompte: (secondesRestantes: number) => void;
    surTempsÉcoulé: () => void;
  };

  const { actif, surDécompte, surTempsÉcoulé }: Props = $props();

  const décrémentEnMs = 1000;

  let secondesRestantes = new Tween(30, { duration: décrémentEnMs });
  let secondesEntièresRestantes = $state(30);

  $effect(() => {
    secondesRestantes.target = secondesEntièresRestantes - 1;
  });

  let palier: 'fini' | 'moins-10-secondes' | 'moins-15-secondes' | 'moins-30-secondes' = $derived.by(() => {
    if (secondesEntièresRestantes <= 0) return 'fini';
    if (secondesEntièresRestantes <= 10) return 'moins-10-secondes';
    if (secondesEntièresRestantes <= 15) return 'moins-15-secondes';
    return 'moins-30-secondes';
  });

  $effect(() => {
    if (actif) {
      const intervalle = setInterval(() => {
        if (secondesEntièresRestantes <= 1) {
          clearInterval(intervalle);
          surTempsÉcoulé();
          return;
        }

        secondesEntièresRestantes -= 1;
      }, décrémentEnMs);

      return () => clearInterval(intervalle);
    }
  });

  $effect(() => {
    if (actif) surDécompte(secondesEntièresRestantes);
  });
</script>

{#if actif}
  <div class="minuteur">
    <p>
      Temps restant&nbsp;: <strong>{secondesEntièresRestantes} seconde{secondesEntièresRestantes > 1 ? 's' : ''}</strong
      >
    </p>
    <progress class={palier} value={secondesRestantes.current} max="30">{secondesRestantes.current}</progress>
  </div>
{/if}

<style lang="scss">
  .minuteur {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background-color: var(--background-alt-grey);

    p {
      margin: 0;
    }

    progress {
      height: 0.5rem;
      background-color: var(--background-default-grey);
      border: none;
      border-radius: 999px;
      overflow: hidden;
      width: 100%;

      &::-webkit-progress-bar {
        background: var(--background-default-grey);
        border-radius: 999px;
      }

      &::-webkit-progress-value {
        background: var(--couleur);
        border-radius: 999px;
      }

      &::-moz-progress-bar {
        background: var(--couleur);
        border-radius: 999px;
      }

      &.moins-30-secondes {
        --couleur: var(--border-default-blue-france);
      }

      &.moins-15-secondes {
        --couleur: var(--background-flat-warning);
      }

      &.moins-10-secondes {
        --couleur: var(--background-flat-error);
      }
    }
  }
</style>
