<script lang="ts">
  import { onMount } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';

  export let filtreActif: boolean;

  let estBureau = false;

  onMount(async () => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });
</script>

{#if !estBureau}
  <div class="sommaire sommaire-replie">
    <details>
      <summary>
        <EnteteFiltres {filtreActif} />
      </summary>
      <div class="barre-filtres">
        <slot />
      </div>
    </details>
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

    &.sommaire-replie {
      z-index: 9;

      &:has(details[open]) {
        padding: 0;

        summary {
          background-color: var(--jaune-clair-msc);
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
