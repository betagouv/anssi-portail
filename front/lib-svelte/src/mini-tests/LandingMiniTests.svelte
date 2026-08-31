<script lang="ts">
  import { type PropriétésFilAriane } from '../ui/filAriane';
  import HerosRiche from '../ui/HerosRiche.svelte';
  import IllustrationHeroMiniTest from './IllustrationHeroMiniTest.svelte';
  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Faire le test !',
  };
</script>

<HerosRiche
  {propriétésFilAriane}
  description="Évaluez votre situation et comprenez mieux les enjeux cyber de votre organisation, simplement et rapidement."
  variante="cafe-creme"
  class="avec-image-fond"
>
  {#snippet titreHtml()}
    Des tests gratuits pour mieux maîtriser les risques cyber
  {/snippet}
  {#snippet illustration()}
    <IllustrationHeroMiniTest />
  {/snippet}
</HerosRiche>

<style lang="scss">
</style>
