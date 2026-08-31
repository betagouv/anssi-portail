<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  import FilAriane, { type PropsFilAriane } from './FilAriane.svelte';

  type Props = {
    titre?: string;
    description?: string;
    propriétésFilAriane?: PropsFilAriane;
    tag?: string;
    srcImage?: string;
    avantLeTitre?: Snippet;
    titreHtml?: Snippet;
    actions?: Snippet;
    illustration?: Snippet;
    class: ClassValue;
  };

  const {
    titre,
    description,
    propriétésFilAriane,
    tag,
    srcImage,
    avantLeTitre,
    titreHtml,
    actions,
    illustration,
    class: className,
  }: Props = $props();
</script>

<div class={['section-hero', className]} class:avecFilAriane={!!propriétésFilAriane}>
  <dsfr-container>
    {#if propriétésFilAriane}
      <FilAriane {...propriétésFilAriane} />
    {/if}

    <div class="conteneur">
      <div class="contenu">
        {#if avantLeTitre}
          {@render avantLeTitre()}
        {:else if tag}
          <span class="tag">{tag}</span>
        {/if}

        <div class="conteneur-titre-description">
          <h1 class="titre alternatif-md">
            {#if titreHtml}
              {@render titreHtml()}
            {:else}
              {titre}
            {/if}
          </h1>

          {#if description}
            <p class="description texte-chapo-xl">
              {description}
            </p>
          {/if}
        </div>

        {#if actions}
          <div class="actions">
            {@render actions()}
          </div>
        {/if}
      </div>

      {#if illustration || srcImage}
        <div class="illustration">
          {#if illustration}
            {@render illustration()}
          {:else}
            <img src={srcImage} alt="" />
          {/if}
        </div>
      {/if}
    </div>
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .section-hero {
    position: relative;
    overflow: hidden;
    padding-block: 6rem;
    background: {
      image:
        url('/assets/images/motif-fond-heros-bleu-clair.avif'),
        linear-gradient(172deg, var(--blue-france-925-125) 0%, var(--blue-france-850-200) 87.91%);
      position:
        -259px -113px,
        center;
      repeat: no-repeat, no-repeat;
      size:
        1744px 1655px,
        cover;
    }

    @include a-partir-de(lg) {
      background: {
        position:
          calc(50% - 45px) -384px,
          center;
        size:
          1460px 1386px,
          cover;
      }
    }

    &.avecFilAriane {
      padding-block: 0 7.5rem;
    }
  }

  .fond-hero {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
  }

  .conteneur {
    display: grid;
    grid-template-areas: 'contenu' 'illustration';
    grid-template-columns: 1fr;
    gap: 3rem;
    position: relative;

    @include a-partir-de(lg) {
      grid-template-areas: 'contenu illustration';
      grid-template-columns: 7fr 5fr;
      gap: 1.5rem;
      align-items: center;
    }
  }

  .contenu {
    grid-area: contenu;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 1rem;
    position: relative;
    z-index: 1;
  }

  .tag {
    background-color: var(--couleur-tag, var(--green-bourgeon-950-100));
    border-radius: 100px;
    color: var(--text-title-grey);
    display: inline-block;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.5rem;
    padding: 0.375rem 1rem;
    width: fit-content;
  }

  .titre {
    margin-block-end: 1rem;
  }

  .description {
    margin-block-end: 0;
  }

  .illustration {
    grid-area: illustration;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }
</style>
