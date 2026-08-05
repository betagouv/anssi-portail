<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre: string;
    paragraphe: string;
    ordre: 'texte-gauche' | 'texte-droite';
    illustration: Snippet;
  };

  const { titre, paragraphe, ordre, illustration }: Props = $props();
</script>

<div class={['bloc-deux-colonnes', ordre]}>
  <div class="contenu">
    <h2 class="titre">{titre}</h2>
    <p class="paragraphe">{paragraphe}</p>
  </div>
  <div class="illustration">
    {@render illustration()}
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .bloc-deux-colonnes {
    display: grid;
    grid-template-areas: 'contenu' 'illustration';
    gap: 1.5rem;
    align-items: center;

    @include a-partir-de(lg) {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    &.texte-gauche {
      @include a-partir-de(lg) {
        grid-template-areas: 'contenu illustration';
      }
    }

    &.texte-droite {
      @include a-partir-de(lg) {
        grid-template-areas: 'illustration contenu';
      }
    }
  }

  .contenu {
    grid-area: contenu;
  }

  .titre {
    margin-block: 0 1rem;
  }

  .paragraphe {
    font-size: 18px;
    line-height: 28px;
    margin: 0;
    padding-block-end: 1.5rem;
    color: var(--text-default-grey);

    @include a-partir-de(lg) {
      padding-block-end: 0;
    }
  }

  .illustration {
    grid-area: illustration;
    display: flex;
    justify-content: center;

    img {
      width: 100%;
      max-width: 486px;
      height: auto;
    }
  }
</style>
