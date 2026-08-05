<script lang="ts">
  import type { Snippet } from 'svelte';
  import FilAriane, { type Props as PropriétésFilAriane } from './FilAriane.svelte';

  type Props = {
    tag?: string;
    titre: string;
    description: string;
    propriétésFilAriane?: PropriétésFilAriane;
    formeDecorative?: string;
    actions?: Snippet;
    illustration: Snippet;
  };

  const {
    tag = undefined,
    titre,
    description,
    propriétésFilAriane = undefined,
    formeDecorative = undefined,
    actions = undefined,
    illustration,
  }: Props = $props();
</script>

<section class="section-hero">
  {#if formeDecorative}
    <img class="forme-decorative" src={formeDecorative} alt="" />
  {/if}
  <dsfr-container>
    {#if propriétésFilAriane}
      <FilAriane {...propriétésFilAriane} />
    {/if}
    <div class="grille-hero">
      <div class="contenu-hero">
        {#if tag}
          <div class="tag-hero">
            <span>{tag}</span>
          </div>
        {/if}
        <h1 class="titre alternatif-md">{@html titre}</h1>
        <p class="description texte-chapo-xl">{@html description}</p>
        {#if actions}
          <div class="actions-hero">
            {@render actions()}
          </div>
        {/if}
      </div>
      <div class="illustration-hero">
        {@render illustration()}
      </div>
    </div>
  </dsfr-container>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .section-hero {
    position: relative;
    background: linear-gradient(177deg, var(--blue-france-925-125) 0%, var(--blue-france-850-200) 88%);
    overflow: hidden;
    padding-bottom: 7.5rem;

    .forme-decorative {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      pointer-events: none;
    }

    .grille-hero {
      display: grid;
      grid-template-areas: 'contenu' 'illustration';
      gap: 2rem;

      @include a-partir-de(lg) {
        grid-template-areas: 'contenu illustration';
        grid-template-columns: 7fr 5fr;
        gap: 1.5rem;
        align-items: center;
      }
    }

    .contenu-hero {
      grid-area: contenu;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      z-index: 1;

      .tag-hero span {
        display: inline-block;
        background-color: var(--green-bourgeon-950-100);
        border-radius: 100px;
        padding: 0.375rem 1rem;
        font-weight: 700;
        font-size: 1rem;
        line-height: 1.5;
        color: var(--text-title-grey);
      }

      .titre {
        margin: 0;
      }

      .description {
        margin: 0;
      }
    }

    .illustration-hero {
      grid-area: illustration;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
  }
</style>
