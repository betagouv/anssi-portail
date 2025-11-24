<script lang="ts">
  import type { Guide } from '../Guide.types';
  import { laCouleurDuBadgeSelonLaCollection } from './guide';

  export let guide: Guide;
  const badges = guide.collections.map((collection) => ({
    label: collection,
    accent: laCouleurDuBadgeSelonLaCollection(collection),
  }));
</script>

<dsfr-badges-group {badges} size="sm"></dsfr-badges-group>
