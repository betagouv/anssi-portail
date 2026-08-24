<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Snippet } from 'svelte';
  import type { Segment } from './filAriane';

  type Props = {
    format: 'banniere' | 'heros' | 'heros-centre' | 'details';
    theme: 'sombre' | 'clair' | 'pastel'; // inversé / clair
    segmentsFilAriane?: Segment[];
    cacheFilAriane?: boolean;
    tags?: Snippet;
    cacheTags?: boolean;
    titre: string;
    description: string;
    actions?: Snippet;
    cacheActions?: boolean;
    illustrationSource?: string;
    illustrationAlt?: string;
    cacheIllustration?: boolean;
    children?: Snippet;
  };

  let {
    format,
    theme = 'sombre',
    segmentsFilAriane = [],
    cacheFilAriane = false,
    tags,
    cacheTags = false,
    titre,
    description,
    actions,
    cacheActions = false,
    illustrationSource = '',
    illustrationAlt = '',
    cacheIllustration = false,
    children,
  }: Props = $props();

  let cacheMentions = $state(false);
  if ((() => format === 'banniere')()) {
    cacheTags = true;
    cacheActions = true;
    cacheIllustration = true;
    cacheMentions = true;
  }

  const ficheCatalogue = $derived(format === 'details');
</script>

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
    <picture class={['illustration', ficheCatalogue ? 'ombre' : '']} slot="media">
      <img src={illustrationSource} width="588" height="330" alt={illustrationAlt} />
    </picture>
  {/if}
</lab-anssi-bandeau-page>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  lab-anssi-bandeau-page {
    overflow: hidden;

    &.pastel {
      --background-color: var(--yellow-moutarde-975-75);
    }
  }

  .illustration {
    align-self: center;
    aspect-ratio: 588 / 300;
    display: grid;
    max-width: 100%;

    &.ombre {
      box-shadow: 0 4px 12px 0 rgba(0, 0, 18, 0.16);
    }

    img {
      object-fit: cover;
      object-position: top;
      aspect-ratio: 588 / 300;
      width: 100%;
      display: block;
      max-height: 100%;
      height: auto;
    }
  }
</style>
