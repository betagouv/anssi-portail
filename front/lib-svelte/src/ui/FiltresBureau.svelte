<script lang="ts">
  import { estServeur } from '$plateforme/environnement';
  import type { Snippet } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';
  import { détecteRendu } from '../utils/rendu.svelte';

  interface Props {
    filtreActif: boolean;
    avantEntete?: Snippet;
    children?: Snippet;
  }

  let { filtreActif, avantEntete, children }: Props = $props();
  const rendu = détecteRendu();
</script>

{#if rendu.estBureau || estServeur}
  <div class="sommaire sommaire-deplie">
    <div class="barre-filtres">
      {@render avantEntete?.()}
      <EnteteFiltres {filtreActif} />
      {@render children?.()}
    </div>
  </div>
{/if}

<style lang="scss">
  .sommaire {
    .barre-filtres {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .barre-filtres {
      gap: 1rem;
    }

    &.sommaire-deplie {
      flex: 1;
      max-width: 282px;

      :global(.chevron) {
        display: none;
      }
    }
  }
</style>
