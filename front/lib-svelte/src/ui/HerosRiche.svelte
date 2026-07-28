<script lang="ts">
  import type { Snippet } from 'svelte';
  import FilAriane, { type Props as PropriétésFilAriane } from './FilAriane.svelte';
  type Props = {
    description: string;
    illustration: Snippet;
    propriétésFilAriane?: PropriétésFilAriane;
    titre: string;
  };

  const { description, illustration, propriétésFilAriane, titre }: Props = $props();
</script>

<dsfr-container class={['conteneur']} class:avecFilAriane={!!propriétésFilAriane}>
  {#if propriétésFilAriane}
    <FilAriane {...propriétésFilAriane} />
  {/if}
  <div class="contenu-heros">
    <h1 class="titre alternatif-md">{titre}</h1>
    <p class="description texte-chapo-xl">{description}</p>
    <div class="illustration">
      {@render illustration()}
    </div>
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .conteneur {
    display: flex;
    padding: 1rem 1rem 6rem;
    background-color: var(--background-contrast-green-bourgeon);

    &.avecFilAriane {
      padding-top: 0;
    }

    .contenu-heros {
      display: grid;
      grid-template-areas:
        'titre'
        'description'
        'illustration';
      @include a-partir-de(lg) {
        grid-template-areas:
          'titre illustration'
          'description illustration';
        column-gap: 1.5rem;
        grid-template-columns: auto taille-pour-colonnes(5);
      }

      .titre {
        grid-area: titre;
        margin-bottom: 1rem;
        @include a-partir-de(lg) {
          margin-bottom: 1.5rem;
        }
      }

      .description {
        grid-area: description;
      }

      .illustration {
        grid-area: illustration;
        display: flex;
        max-width: taille-pour-colonne(8);
        margin: auto;
      }
    }
  }
</style>
