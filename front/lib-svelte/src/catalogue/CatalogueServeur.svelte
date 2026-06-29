<script lang="ts">
  import Catalogue from './Catalogue.svelte';
  import type { ItemCyber, RepartitionParBesoin } from './Catalogue.types';
  import type { Guide } from './Guide.types';
  import { guidePourCarteItem } from './guides/guide';
  import { catalogueStore } from './stores/catalogue.store';
  import { guidesStore } from './stores/guides/guides.store';

  export let itemsCyber: ItemCyber[];
  export let repartition: RepartitionParBesoin;
  export let guides: Guide[];
  catalogueStore.initialise(itemsCyber, repartition);
  guidesStore.initialise(guides.map(guidePourCarteItem));
</script>

<Catalogue></Catalogue>
