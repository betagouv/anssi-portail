<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre?: string;
    icone?: string;
    estOuverte: boolean;
    children: Snippet;
    actions?: Snippet;
    surFermeture?: () => void;
  };

  let { titre, icone, estOuverte = $bindable(), children, actions, surFermeture }: Props = $props();

  const ferme = () => {
    estOuverte = false;
    surFermeture?.();
  };
</script>

{#if estOuverte}
  <dsfr-modal title={titre} icon={icone} opened={estOuverte} footer={Boolean(actions)} onclose={ferme}>
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
    width: 100%;

    @include a-partir-de(lg) {
      flex-direction: row-reverse;
    }
  }
</style>
