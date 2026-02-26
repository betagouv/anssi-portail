<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Props = {
    estOuverte: boolean;
    children: Snippet;
    actions?: Snippet;
  };

  let { estOuverte = $bindable(), children, actions }: Props = $props();
</script>

{#if estOuverte}
  <div class="modale">
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
  </div>
{/if}

<style lang="scss">
  .modale {
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 11;
    background: white;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;

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
      border-top: 1px solid var(--border-default-grey);
      padding: 16px;
    }
  }
</style>
