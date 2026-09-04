<script lang="ts">
  import type { Snippet } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';
  import { détecteRendu } from '../utils/rendu.svelte';

  interface Props {
    filtreActif: boolean;
    children?: Snippet;
  }

  let { filtreActif, children }: Props = $props();
  const rendu = détecteRendu();
</script>

{#if rendu.estMobile}
  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <EnteteFiltres {filtreActif} />
      </summary>
      <div class="barre-filtres">
        {@render children?.()}
      </div>
    </details>
  </div>
{/if}

<style lang="scss">
  .sommaire {
    max-height: 100dvh;

    .barre-filtres {
      display: flex;
      flex-direction: column;
      width: calc(100dvw - 32px);
    }

    .barre-filtres {
      gap: 1rem;
    }

    &.sommaire-replie {
      z-index: calc(var(--ground) + 751);

      &:has(details[open]) {
        padding: 0;
        z-index: calc(var(--ground) + 761);

        summary {
          background-color: var(--blue-france-925-125);
          padding: 12px 16px;
        }

        .barre-filtres {
          box-sizing: border-box;
          padding: 1rem;
        }
      }
    }
  }
</style>
