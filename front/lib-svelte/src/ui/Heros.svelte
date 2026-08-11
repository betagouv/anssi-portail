<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Snippet } from 'svelte';
  import Alternatives from './Alternatives.svelte';
  import type { Segment } from './filAriane';

  type Props = {
    format: 'banniere' | 'heros' | 'heros-centre' | 'details';
    theme: 'sombre' | 'clair' | 'pastel'; // inversé / clair
    filAriane?: Snippet;
    segmentsFilAriane?: Segment[];
    cacheFilAriane?: boolean;
    lienRetour?: Snippet;
    tags?: Snippet;
    cacheTags?: boolean;
    preambule?: Snippet<[{ titre: string; description: string }]>;
    titre: string;
    description: string;
    actions?: Snippet;
    cacheActions?: boolean;
    illustration?: Snippet<[{ source: string; alt: string }]>;
    illustrationSource?: string;
    illustrationAlt?: string;
    ficheCatalogue?: boolean;
    cacheIllustration?: boolean;
    children?: Snippet;
  };

  let {
    format,
    theme = 'sombre',
    filAriane,
    segmentsFilAriane = [],
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
    illustrationSource = '',
    illustrationAlt = '',
    ficheCatalogue = false,
    cacheIllustration = false,
    children,
  }: Props = $props();

  let styleTitreH1 = $state('');
  let cacheMentions = $state(false);
  if ((() => format === 'banniere')()) {
    cacheTags = true;
    cacheActions = true;
    cacheIllustration = true;
    cacheMentions = true;
  }
  if ((() => ['heros', 'details'].includes(format))()) {
    styleTitreH1 = 'alternatif-xs';
  }
</script>

<Alternatives affichageAlternatif={afficheNouvelleDA}>
  {#snippet défaut()}
    <dsfr-container class={[format, 'fond-' + theme]}>
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
          <picture class={['illustration']} class:ficheCatalogue>
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
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <lab-anssi-bandeau-page
      simple={format === 'banniere'}
      {ficheCatalogue}
      inverse={theme === 'clair' || theme === 'pastel'}
      class:pastel={theme === 'pastel'}
      avecBadges={!cacheTags}
      avecFilAriane={!cacheFilAriane}
      liensFilAriane={enPropriétéWebC(segmentsFilAriane)}
      {titre}
      {description}
      sansImage={cacheIllustration}
      urlImage={illustrationSource}
    >
      <ol slot="seo">
        {#each segmentsFilAriane as segment, index (segment.id)}
          {@const isLast = index === segmentsFilAriane.length - 1}
          <li>
            {#if isLast}
              <span>{segment.label}</span>
            {:else}
              <a href={segment.href}>{segment.label}</a>
            {/if}
          </li>
        {/each}
      </ol>
      {#if tags}
        <div slot="badgesgroup">
          {@render tags()}
        </div>
      {/if}
      <h1 slot="seo">{titre}</h1>
      <p slot="seo">{description}</p>
      {#if !cacheActions && actions}
        <div slot="buttonsgroup">
          {@render actions()}
        </div>
      {/if}
      {#if !cacheMentions && children}
        <div slot="seo">
          {@render children()}
        </div>
      {/if}
      {#if !cacheIllustration}
        <picture slot="seo">
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
    </lab-anssi-bandeau-page>
  {/snippet}
</Alternatives>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .banniere,
  .heros,
  .heros-centre,
  .details {
    box-sizing: border-box;

    &.fond-sombre {
      background-color: var(--background-flat-blue-france-lab);
      background-image: url(/assets/images/motif-fond-service-opacite-16.avif);
    }
    &.fond-clair {
      background-image: url('/assets/images/motif-fond-service.avif');
      background-color: var(--couleur-fond, #eee);
    }
  }

  lab-anssi-bandeau-page.pastel {
    --background-color: var(--yellow-moutarde-975-75);
  }

  .banniere,
  .heros,
  .heros-centre,
  .details {
    .contenu-section {
      padding: 16px 0;

      // 320px et plus (Mobile first)
      display: grid;
      gap: 0 1.5rem;
      grid-template-areas:
        'haut'
        'texte'
        'illustration';
      grid-template-rows: 20px 1fr;
      width: clamp(288px, 100%, 75rem);

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

        &.ficheCatalogue {
          align-self: flex-end;
        }

        img {
          max-width: 100%;
          align-self: center;
          justify-self: center;

          @include a-partir-de(md) {
            max-width: none;
          }
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
        grid-template-rows: 32px 1fr;
      }
    }
  }

  .banniere {
    .contenu-section {
      padding: 24px 0;

      &:has(.fil-ariane),
      &:has(.lien-retour) {
        padding: 16px 0 24px;

        hgroup {
          margin: 1rem 0 0;
        }
      }
    }
  }

  .heros,
  .heros-centre {
    .contenu-section {
      padding: 48px 0;

      hgroup {
        margin: 0;

        h1 {
          margin: 0 0 0.5rem;
        }
        @include a-partir-de(lg) {
          padding-right: 32px;
        }
      }

      .fil-ariane,
      .lien-retour {
        @include a-partir-de(lg) {
          margin-bottom: 0.75rem;
        }
      }

      .fil-ariane {
        padding: 0 0 48px;
        max-height: 20px;
      }

      &:has(.fil-ariane),
      &:has(.lien-retour) {
        padding: 16px 0 48px;

        hgroup {
          margin: 1.5rem 0 0.5rem;
        }

        @include a-partir-de(lg) {
          hgroup {
            margin-top: 0;
          }
        }
      }
    }
  }

  .details {
    overflow-y: hidden;
    .contenu-section {
      padding: 16px 0 0;

      .actions {
        flex-direction: row;
        min-height: 2.5rem;
      }

      @include a-partir-de(md) {
        .actions {
          margin-bottom: 4.5rem;
        }
      }

      .illustration {
        box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
        img {
          width: 100%;
        }
      }
    }
  }
</style>
