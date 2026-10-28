<script lang="ts">
  import type { PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import IllustrationHerosKitSensibilisation from './animation/IllustrationHerosKitSensibilisation.svelte';

  const propriétésFilAriane: PropriétésFilAriane = { feuille: 'Kit de sensibilisation interne' };
</script>

<HerosRiche
  description="Un plan de sensibilisation avec 6 thématiques (affiches et courriels) à déployer au rythme de votre organisation. L’ordre proposé suit une progression logique."
  {propriétésFilAriane}
  titre="Kit de sensibilisation interne"
  variante="bleu-clair"
>
  {#snippet illustration()}
    <IllustrationHerosKitSensibilisation />
  {/snippet}
</HerosRiche>
