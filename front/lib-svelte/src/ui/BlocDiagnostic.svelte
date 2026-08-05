<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    titre: string;
    paragraphe: string;
    labelBouton: string;
    lienBouton?: string;
    illustration: Snippet;
  };

  const { titre, paragraphe, labelBouton, lienBouton = undefined, illustration }: Props = $props();
</script>

<div class="grille-diagnostic">
  <div class="contenu-diagnostic">
    <h2 class="fr-h4">{titre}</h2>
    <p>{paragraphe}</p>
    <dsfr-button label={labelBouton} href={lienBouton} kind="secondary" size="lg"></dsfr-button>
  </div>
  <div class="illustration-diagnostic">
    {@render illustration()}
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .grille-diagnostic {
    display: grid;
    grid-template-areas: 'contenu' 'illustration';
    gap: 2rem;

    @include a-partir-de(lg) {
      grid-template-areas: 'contenu illustration';
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      align-items: center;
    }
  }

  .contenu-diagnostic {
    grid-area: contenu;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h2 {
      margin: 0;
    }

    p {
      margin: 0;
      color: var(--text-default-grey);
    }
  }

  .illustration-diagnostic {
    grid-area: illustration;
    display: flex;
    justify-content: center;

    :global(img) {
      width: 100%;
      max-width: 486px;
      height: auto;
      border-radius: 12px;
    }
  }
</style>
