<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="conteneur-graphique-dsfr">
  {@render children()}
</div>

<style lang="scss">
  /* Les graphiques DSFR Chart se mettent en page en supposant le reset et les classes
     utilitaires du DSFR, que MSC ne charge pas. On les redéfinit ici, limités au
     conteneur, plutôt que d'importer dsfr.min.css dont le reset s'appliquerait à tout le site. */
  .conteneur-graphique-dsfr {
    box-sizing: border-box;

    :global {
      *,
      ::before,
      ::after {
        box-sizing: inherit;
      }

      p {
        margin: var(--text-spacing, 0 0 1.5rem);
      }

      .fr-grid-row {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
      }

      .fr-col-12 {
        flex: 0 0 100%;
        max-width: 100%;
        width: 100%;
      }

      .fr-mb-0 {
        margin-bottom: 0;
      }

      .fr-mb-1v {
        margin-bottom: 0.25rem;
      }

      .fr-ml-1w {
        margin-left: 0.5rem;
      }

      .fr-mt-3v {
        margin-top: 0.75rem;
      }

      .fr-mt-4v {
        margin-top: 1rem;
      }

      .fr-text--bold {
        font-weight: 700;
      }

      .fr-text--sm {
        font-size: 0.875rem;
        line-height: 1.5rem;
      }
    }
  }
</style>
