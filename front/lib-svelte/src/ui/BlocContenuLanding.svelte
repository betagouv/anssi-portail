<script lang="ts">
  type Props = {
    titre: string;
    description: string;
    alignement: 'texte-gauche' | 'texte-droite';
    illustration: {
      src: string;
      alt: string;
    };
  };

  const { titre, description, alignement, illustration }: Props = $props();
</script>

<div class={['bloc-contenu', alignement]}>
  <div class="contenu">
    <h2 class="titre">{titre}</h2>
    <p class="description">{description}</p>
  </div>

  <div class="illustration">
    <img src={illustration.src} alt={illustration.alt} />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .bloc-contenu {
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

  .description {
    font-size: 1.125rem;
    line-height: 1.75rem;
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
