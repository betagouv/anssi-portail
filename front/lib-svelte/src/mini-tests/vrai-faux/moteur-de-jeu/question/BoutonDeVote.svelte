<script lang="ts">
  import { clic } from '../../../../directives/actions.svelte';

  type Réponse = 'faux' | 'vrai';

  interface Props {
    réfBouton?: HTMLButtonElement;
    estCible: boolean;
    réponse: Réponse;
    surVote: () => void;
  }

  let { réfBouton = $bindable(), estCible, réponse, surVote }: Props = $props();

  const libellé = $derived(réponse === 'faux' ? 'Faux' : 'Vrai');
  const icône = $derived(réponse === 'faux' ? 'thumb-down-fill' : 'thumb-up-fill');
</script>

<button
  bind:this={réfBouton}
  use:clic={surVote}
  class:est-cible={estCible}
  class:vote-faux={réponse === 'faux'}
  class:vote-vrai={réponse === 'vrai'}
  aria-label={`Vote-${libellé}`}
>
  <lab-anssi-icone nom={icône}></lab-anssi-icone>
  <p class="texte-standard-md" class:vote-faux={réponse === 'faux'} class:vote-vrai={réponse === 'vrai'}>
    {libellé}
  </p>
</button>

<style lang="scss">
  button {
    display: flex;
    padding: 3.5rem 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    flex: 1 0 0;
    border-radius: 1.5rem;
    border: 0;
    width: 30%;
    transition:
      background-color 160ms ease,
      transform 160ms ease;

    &.est-cible {
      animation: rebond-cible 240ms ease-out forwards;
    }

    p {
      background-color: transparent;
      color: inherit;
    }

    &.vote-faux {
      background-color: var(--background-contrast-error);
      color: var(--text-default-error);

      &.est-cible {
        background-color: #ffc5c5;
      }
    }

    &.vote-vrai {
      background-color: var(--background-contrast-success);
      color: var(--text-default-success);

      &.est-cible {
        background-color: #46fd89;
      }
    }
  }

  @keyframes rebond-cible {
    0% {
      transform: scale(1);
    }
    55% {
      transform: scale(1.09);
    }
    75% {
      transform: scale(1.04);
    }
    100% {
      transform: scale(1.06);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition-duration: 0.01ms;

      &.est-cible {
        animation: none;
        transform: scale(1.06);
      }
    }
  }
</style>
