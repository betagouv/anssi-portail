<script lang="ts">
  import type { Snippet } from 'svelte';
  import FilAriane, { type Props as PropriétésFilAriane } from './FilAriane.svelte';

  type Props = {
    actions?: Snippet;
    description: string;
    illustration: Snippet;
    propriétésFilAriane?: PropriétésFilAriane;
    titre: string;
    variante: 'bleu-clair' | 'vert-clair';
  };

  const { actions, description, illustration, propriétésFilAriane, titre, variante }: Props = $props();
</script>

<dsfr-container class={['conteneur', variante]} class:avecFilAriane={!!propriétésFilAriane}>
  {#if propriétésFilAriane}
    <FilAriane {...propriétésFilAriane} />
  {/if}
  <div class="contenu-heros">
    <h1 class="titre alternatif-md">{titre}</h1>
    <p class="description texte-chapo-xl">{description}</p>
    {#if actions}
      <div class="actions">
        {@render actions()}
      </div>
    {/if}
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

    &.bleu-clair {
      background-color: var(--blue-france-925-125);
    }

    &.vert-clair {
      background-color: var(--background-contrast-green-bourgeon);
    }

    &.avecFilAriane {
      padding-top: 0;
    }

    .contenu-heros {
      display: grid;
      grid-template-areas:
        'titre'
        'description'
        'actions'
        'illustration';
      @include a-partir-de(lg) {
        grid-template-areas:
          'titre illustration'
          'description illustration'
          'actions illustration';
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
        margin-bottom: 2rem;
      }

      .actions {
        display: flex;
        flex-direction: column;
        grid-area: actions;
        margin-bottom: 3rem;
        @include a-partir-de(md) {
          flex-direction: row;
          margin-bottom: 0;
        }
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
