<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Props = {
    estOuverte: boolean;
    children: Snippet;
    actions?: Snippet;
  };

  let { estOuverte = $bindable(), children, actions }: Props = $props();

  let dialogue = $state<HTMLDialogElement | undefined>();

  $effect(() => {
    if (dialogue) {
      if (estOuverte) {
        dialogue.showModal();
      } else {
        dialogue.close();
      }
    }
  });

  const fermeDialogue = () => {
    dialogue?.close();
    estOuverte = false;
  };
</script>

{#if estOuverte}
  <dialog bind:this={dialogue} onclose={fermeDialogue}>
    <div class="entete">
      <dsfr-button
        label="Fermer"
        has-icon
        icon-place="right"
        icon="close-line"
        kind="tertiary-no-outline"
        use:clic={fermeDialogue}
      ></dsfr-button>
    </div>
    <div class="contenu">
      {@render children()}
    </div>
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
  </dialog>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dialog[open] {
    display: flex;
    flex-direction: column;
    width: 100vw;
    width: 100dvw;
    height: 100vh;
    height: 100dvh;
    max-width: 100vw;
    max-width: 100dvw;
    max-height: 100vh;
    max-height: 100dvh;
    padding: 0;
    margin: 0;
    border: none;
    z-index: 11;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }

    .entete {
      display: flex;
      flex-direction: row-reverse;
      padding: 16px 16px 8px;
    }

    .contenu {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 0 16px;
    }

    .actions {
      align-items: stretch;
      border-top: 1px solid var(--border-default-grey);
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    @include a-partir-de(lg) {
      height: min-content;
      max-height: 90vh;
      max-height: 90dvh;
      max-width: 588px;
      min-width: 0;
      margin: auto;
      padding: 0 16px;
      border-radius: 8px;

      .actions {
        border-top: none;
        flex-direction: row-reverse;
      }
    }
  }
</style>
