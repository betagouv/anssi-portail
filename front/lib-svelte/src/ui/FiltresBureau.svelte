<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import EnteteFiltres from '../catalogue/EnteteFiltres.svelte';
  import { estServeur } from '$plateforme/environnement';

  interface Props {
    filtreActif: boolean;
    avantEntete?: Snippet;
    children?: Snippet;
  }

  let { filtreActif, avantEntete, children }: Props = $props();
  let estBureau = $state(false);

  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    const actualiseAffichage = (e: MediaQueryListEvent) => (estBureau = e.matches);
    mql.addEventListener('change', actualiseAffichage);
    estBureau = mql.matches;
    return () => mql.removeEventListener('change', actualiseAffichage);
  });
</script>

{#if estBureau || estServeur}
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
