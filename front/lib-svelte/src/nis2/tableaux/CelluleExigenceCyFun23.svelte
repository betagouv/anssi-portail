<script lang="ts">
  import { badgesExigence, type ExigenceCyFun23 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceCyFun23;
</script>

<td>
  <dsfr-badges-group badges={badgesExigence(exigence)}></dsfr-badges-group>
  <dsfr-tag label={exigence.reference}></dsfr-tag>
  <ContenuExigenceFormate {exigence} />
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
  }
</style>
