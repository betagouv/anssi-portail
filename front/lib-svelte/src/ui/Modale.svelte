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
</script>

{#if estOuverte}
  <dialog bind:this={dialogue}>
    <div class="entete">
      <dsfr-button
        label="Fermer"
        has-icon
        icon-place="right"
        icon="close-line"
        kind="tertiary-no-outline"
        use:clic={() => (estOuverte = false)}
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
  dialog {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    padding: 0;
    margin: 0;
    border: none;
    z-index: 11;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }

    @include a-partir-de(lg) {
      height: auto;
      max-height: 90vh;
      max-width: 588px;
      min-width: 0;
      margin: auto;
      padding: 0 16px;
      border-radius: 8px;
    }

    .entete {
      display: flex;
      flex-direction: row-reverse;
      padding: 16px 16px 8px;
    }

    .contenu {
      flex: 1 0 0;
      overflow-y: auto;
      padding: 0 16px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border-default-grey);
      padding: 16px;
      gap: 16px;
    }
  }
</style>
