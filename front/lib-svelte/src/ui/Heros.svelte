<script lang="ts">
  import { BandeauPage } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';
  import { fabriqueFilAriane, type PropriétésFilAriane } from './filAriane';

  type Props = {
    format: 'banniere' | 'heros' | 'heros-centre' | 'details';
    theme: 'sombre' | 'clair' | 'pastel'; // inversé / clair
    propriétésFilAriane?: PropriétésFilAriane;
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
    propriétésFilAriane,
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
  const segmentsFilAriane = $derived(fabriqueFilAriane(propriétésFilAriane));
</script>

<div class="heros" class:pastel={theme === 'pastel'}>
  <BandeauPage
    type={format === 'banniere' ? 'simple' : ficheCatalogue ? 'fiche' : 'default'}
    theme={theme === 'sombre' ? 'sombre' : 'clair'}
    avecFilAriane={!!segmentsFilAriane.length}
    liensFilAriane={segmentsFilAriane}
    {titre}
    {description}
    sansBoutons={cacheActions}
    sansImage={cacheIllustration}
    sansMention={cacheMentions}
    urlImage={illustrationSource}
  >
    <svelte:fragment slot="badgesgroup">
      {#if !cacheTags && tags}
        {@render tags()}
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="buttonsgroup">
      {#if !cacheActions && actions}
        {@render actions()}
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="mention">
      {#if !cacheMentions && children}
        {@render children()}
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="media">
      {#if !cacheIllustration}
        <picture class={['illustration', ficheCatalogue ? 'ombre' : '']}>
          <img src={illustrationSource} width="588" height="330" alt={illustrationAlt} />
        </picture>
      {/if}
    </svelte:fragment>
  </BandeauPage>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .heros {
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
