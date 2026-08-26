<script lang="ts">
  import GroupeDeBadges from '../../ui/GroupeDeBadges.svelte';
  import { CollectionGuide, type Guide } from '../Guide.types';
  import { laCouleurDuBadgeSelonLaCollection } from './guide';

  interface Props {
    guide: Guide;
  }

  let { guide }: Props = $props();

  const badges = $derived(
    guide.collections
      .filter((c) => c !== CollectionGuide.AUTRE)
      .map((collection) => ({
        label: collection,
        accent: laCouleurDuBadgeSelonLaCollection(collection),
      }))
  );
</script>

<GroupeDeBadges {badges} />
