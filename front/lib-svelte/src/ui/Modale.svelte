<script lang="ts">
  import { DsfrModal } from '@lab-anssi/ui-kit';
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

  const id = $props.id();
</script>

{#if estOuverte}
  <DsfrModal title={titre} icon={icone} opened={estOuverte} footer={Boolean(actions)} onclose={ferme} {id}>
    {@render children()}
    <svelte:fragment slot="footer">
      {#if actions}
        <div class="actions">
          {@render actions()}
        </div>
      {/if}
    </svelte:fragment>
  </DsfrModal>
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
