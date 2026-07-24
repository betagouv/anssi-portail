<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre?: string;
    icone?: string;
    estOuverte: boolean;
    children: Snippet;
    actions?: Snippet;
  };

  let { titre, icone, estOuverte = $bindable(), children, actions }: Props = $props();
</script>

{#if estOuverte}
  <dsfr-modal
    title={titre}
    icon={icone}
    opened={estOuverte}
    footer={Boolean(actions)}
    onclose={() => (estOuverte = false)}
  >
    {@render children()}
    {#if actions}
      <div slot="footer" class="actions">
        {@render actions()}
      </div>
    {/if}
  </dsfr-modal>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .actions {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;

    @include a-partir-de(lg) {
      flex-direction: row-reverse;
    }
  }
</style>
