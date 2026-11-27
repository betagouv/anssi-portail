<script lang="ts">
  import type { Snippet } from 'svelte';

  import IllustrationDemandeAide from '@demande-aide-mon-aide-cyber/IllustrationDemandeAide.svelte';
  import Lien from './Lien.svelte';

  type Props = {
    titre: string;
    description: string | Snippet;
    labelBouton?: string;
    lienBouton?: string;
    illustration?: Snippet;
  };

  const { titre, description, labelBouton, lienBouton, illustration }: Props = $props();
</script>

<div class="bloc-diagnostic">
  <div class="contenu">
    <h2 class="titre fr-h4">{titre}</h2>
    {#if typeof description === 'string'}
      <p class="description">{description}</p>
    {:else}
      {@render description()}
    {/if}
    {#if labelBouton && lienBouton}
      <Lien apparence="bouton" libelle={labelBouton} type="secondaire" taille="lg" href={lienBouton} />
    {/if}
  </div>

  <div class="illustration">
    {#if illustration}
      {@render illustration()}
    {:else}
      <IllustrationDemandeAide large />
    {/if}
  </div>
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

  .illustration {
    :global(img) {
      height: auto;
      max-width: 100%;
    }
  }
</style>
