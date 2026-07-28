<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { CollectionGuide, type Guide } from '../Guide.types';
  import { laCouleurDuBadgeSelonLaCollection } from './guide';

  export let guide: Guide;
  const badges = guide.collections
    .filter((c) => c !== CollectionGuide.AUTRE)
    .map((collection) => ({
      label: collection,
      accent: laCouleurDuBadgeSelonLaCollection(collection),
    }));
</script>

<dsfr-badges-group badges={enPropriétéWebC(badges)} size="sm">
  <ul slot="seo">
    {#each badges as badge (badge)}
      <li>{badge.label}</li>
    {/each}
  </ul>
</dsfr-badges-group>
