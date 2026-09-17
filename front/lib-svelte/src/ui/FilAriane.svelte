<script module lang="ts">
  export type PropsFilAriane = Props;
</script>

<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Segment } from './filAriane';

  type Props = {
    segments: Segment[];
    fondSombre?: boolean;
  };

  const { segments, fondSombre = false }: Props = $props();
</script>

<dsfr-breadcrumb inverse={fondSombre} buttonLabel="Voir le fil d'Ariane" segments={enPropriétéWebC(segments)}>
  <ol slot="seo" class="fr-breadcrumb__list">
    {#each segments as segment, index (segment.id)}
      {@const isLast = index === segments.length - 1}
      <li>
        {#if isLast}
          <span>{segment.label}</span>
        {:else}
          <a href={segment.href}>{segment.label}</a>
        {/if}
      </li>
    {/each}
  </ol>
</dsfr-breadcrumb>
