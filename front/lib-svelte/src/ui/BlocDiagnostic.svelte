<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre: string;
    description: string;
    labelBouton?: string;
    lienBouton?: string;
    illustration?: Snippet;
  };

  const { titre, description, labelBouton, lienBouton, illustration }: Props = $props();
</script>

<div class="bloc-diagnostic">
  <div class="contenu">
    <h2 class="titre fr-h4">{titre}</h2>
    <p class="description">{description}</p>
    {#if labelBouton}
      <dsfr-button label={labelBouton} kind="secondary" size="lg" markup="a" href={lienBouton}></dsfr-button>
    {/if}
  </div>

  {#if illustration}
    <div class="illustration">
      {@render illustration()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .bloc-diagnostic {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    @include a-partir-de(lg) {
      flex-direction: row;
    }
  }

  .contenu,
  .illustration {
    flex: 1;
  }

  .titre {
    margin-block-end: 16px;
  }

  .description {
    margin-block: 0 24px;
    color: var(--text-default-grey);
  }

  dsfr-button {
    text-align: center;
  }

  .illustration {
    :global(img) {
      height: auto;
      max-width: 100%;
    }
  }
</style>
