<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    format: 'banniere' | 'heros' | 'heros-centre' | 'details';
    theme: 'sombre' | 'clair'; // inversé / clair
    filAriane?: Snippet;
    cacheFilAriane?: boolean;
    lienRetour?: Snippet;
    tags?: Snippet;
    cacheTags: boolean;
    preambule?: Snippet<[{ titre: string; description: string }]>;
    titre: string;
    description: string;
    actions?: Snippet;
    cacheActions: boolean;
    illustration?: Snippet<[{ source: string; alt: string }]>;
    illustrationSource: string;
    illustrationAlt: string;
    cacheIllustration: boolean;
    children?: Snippet;
  };

  let {
    format,
    theme = 'sombre',
    filAriane,
    cacheFilAriane = false,
    lienRetour,
    tags,
    cacheTags = false,
    preambule,
    titre,
    description,
    actions,
    cacheActions = false,
    illustration,
    illustrationSource,
    illustrationAlt,
    cacheIllustration = false,
    children,
  }: Props = $props();

  let styleTitreH1 = $state('');
  let cacheMentions = $state(false);
  if (format === 'banniere') {
    cacheTags = true;
    cacheActions = true;
    cacheIllustration = true;
    cacheMentions = true;
  }
  if (format === 'heros') {
    styleTitreH1 = 'alternatif-xs';
  }
</script>

<section class={[format, 'fond-' + theme]}>
  <div class="contenu-section">
    {#if !cacheFilAriane && filAriane}
      <div class={['fil-ariane']}>
        {@render filAriane()}
      </div>
    {:else if lienRetour}
      <div class={['lien-retour']}>
        {@render lienRetour()}
      </div>
    {/if}
    <div class="texte">
      {#if !cacheTags && tags}
        <div class={['tags']}>
          {@render tags()}
        </div>
      {/if}
      <hgroup>
        {#if preambule}
          {@render preambule({ titre, description })}
        {:else}
          <h1 class={[styleTitreH1]}>{titre}</h1>
          <p class={['texte-chapo-xl']}>{description}</p>
        {/if}
      </hgroup>
      {#if !cacheActions && actions}
        <div class={['actions']}>
          {@render actions()}
        </div>
      {/if}
      {#if !cacheMentions && children}
        <div class={['mentions']}>
          {@render children()}
        </div>
      {/if}
    </div>
    {#if !cacheIllustration}
      <picture class={['illustration']}>
        {#if illustration}
          {@render illustration({
            source: illustrationSource,
            alt: illustrationAlt,
          })}
        {:else}
          <img src={illustrationSource} alt={illustrationAlt} />
        {/if}
      </picture>
    {/if}
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .banniere,
  .heros,
  .heros-centre,
  .details {
    box-sizing: border-box;

    &.fond-sombre {
      background-color: var(--couleur-fond-sombre, #0d0c21);
      background-image: url(/assets/images/motif-fond-service-opacite-16.avif);
      color: var(--couleur-texte-sombre, #fff);
    }
    &.fond-clair {
      background-color: var(--couleur-fond, #eee);
    }
  }

  .banniere,
  .heros,
  .heros-centre,
  .details {
    .contenu-section {
      padding: 16px var(--gouttiere);

      // 320px et plus (Mobile first)
      display: grid;
      gap: 0 1.5rem;
      grid-template-areas:
        'haut'
        'texte'
        'illustration';
      width: clamp(288px, calc(100% - var(--gouttiere) * 2), 75rem);

      .fil-ariane,
      .lien-retour {
        grid-area: haut;
      }

      .texte {
        align-self: center;
        grid-area: texte;
      }

      .illustration {
        align-self: center;
        aspect-ratio: 16 / 9;
        display: grid;
        grid-area: illustration;

        img {
          align-self: center;
          justify-self: center;
        }
      }

      hgroup {
        margin: 0;

        h1 {
          margin: 0 0 0.75rem;
        }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        @include a-partir-de(md) {
          flex-direction: row;
          flex-wrap: wrap;
        }
      }
    }
  }

  .heros,
  .heros-centre,
  .details {
    .contenu-section {
      .actions {
        margin: 0;
      }

      // 768px et plus
      @include a-partir-de(md) {
      }

      // 1248px et plus
      @include a-partir-de(lg) {
        grid-template-areas:
          'haut haut'
          'texte illustration';
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
      }
    }
  }

  .banniere {
    .contenu-section {
      padding: 24px var(--gouttiere);

      &:has(.fil-ariane),
      &:has(.lien-retour) {
        padding: 16px var(--gouttiere) 24px;

        hgroup {
          margin: 1rem 0 0;
        }
      }
    }
  }

  .heros,
  .heros-centre {
    .contenu-section {
      padding: 48px var(--gouttiere);

      hgroup {
        margin: 0;

        h1 {
          margin: 0 0 0.5rem;
        }
      }

      &:has(.fil-ariane),
      &:has(.lien-retour) {
        padding: 16px var(--gouttiere) 48px;

        hgroup {
          margin: 1.5rem 0 0.5rem;
        }

        @include a-partir-de(lg) {
          hgroup {
            margin-top: 0;
          }
        }
      }

      .fil-ariane,
      .lien-retour {
        + hgroup {
          margin: 1.5rem 0 0;
        }
      }
    }
  }

  .details {
    .contenu-section {
      padding: 16px var(--gouttiere) 0;

      .fil-ariane,
      .lien-retour {
        + hgroup {
          margin: 1.5rem 0 0;
        }
      }

      .actions {
        flex-direction: row;
        min-height: 2.5rem;

        + .illustration {
          margin: 3rem 0 0;
        }
      }

      @include a-partir-de(md) {
        .fil-ariane,
        .lien-retour {
          + hgroup {
            margin-top: 4.5rem;
          }
        }

        .actions {
          margin-bottom: 4.5rem;

          + .illustration {
            margin: 0;
          }
        }
      }
    }
  }
</style>
