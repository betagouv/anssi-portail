<script lang="ts">
  import IllustrationAnimee from '../IllustrationAnimee.svelte';
  import Association from './Association.svelte';
  import DPO from './DPO.svelte';
  import DSI from './DSI.svelte';
  import RSSI from './RSSI.svelte';

  const { enPause = false }: { enPause?: boolean } = $props();

  const scènes = [DSI, DPO, Association, RSSI];
</script>

<IllustrationAnimee
  {scènes}
  ratio="522 / 363"
  étiquette="Des responsables d’organisations protègent leur activité, leurs données et leurs équipes."
  {enPause}
/>
