<script lang="ts">
  import { clic } from '../../directives/actions.svelte';

  export type Réponse = 'Légitime' | 'Hameçonnage';

  interface Props {
    réponse: Réponse;
    surVote: () => void;
  }

  let { réponse, surVote }: Props = $props();

  const libellé = $derived(réponse === 'Hameçonnage' ? 'Hameçonnage' : 'Légitime');
  const icône = $derived(réponse === 'Hameçonnage' ? 'alarm-warning-fill' : 'mail-check-fill');
</script>

<button
  use:clic={surVote}
  class:vote-hameconnage={réponse === 'Hameçonnage'}
  class:vote-legitime={réponse === 'Légitime'}
  aria-label={`Vote-${libellé}`}
>
  <lab-anssi-icone nom={icône} taille="lg"></lab-anssi-icone>
  <p
    class="texte-standard-md"
    class:vote-hameconnage={réponse === 'Hameçonnage'}
    class:vote-legitime={réponse === 'Légitime'}
  >
    {libellé}
  </p>
</button>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;

  button {
    display: flex;
    padding: 1rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    border: 0;
    flex: 1;
    min-width: 0;

    lab-anssi-icone {
      flex-shrink: 0;
    }

    &:hover {
      cursor: pointer;
    }

    &:focus-visible {
      outline: 2px solid var(--bleu-contour-mis-en-valeur);
      outline-offset: 2px;
      border-style: none;
    }

    p {
      background-color: transparent;
      color: inherit;
      font-weight: 500;
      margin: 0;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.vote-hameconnage {
      background-color: var(--background-contrast-error);
      color: var(--text-default-error);

      &:hover,
      &:focus-visible {
        background-color: var(--error-950-100-hover);
      }

      &:active {
        background-color: var(--error-950-100-active);
      }
    }

    &.vote-legitime {
      background-color: var(--background-contrast-success);
      color: var(--text-default-success);

      &:hover,
      &:focus-visible {
        background-color: var(--success-950-100-hover);
      }

      &:active {
        background-color: var(--success-950-100-active);
      }
    }

    @include a-partir-de(lg) {
      border-radius: 1.5rem;
      flex-direction: column;
      padding-block: 1.25rem;
    }
  }
</style>
