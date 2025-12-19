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

{#if estBureau}
  <div class="sommaire sommaire-deplie">
    <div class="barre-filtres">
      <slot name="avant-entete" />
      <EnteteFiltres {filtreActif} />
      <slot />
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
