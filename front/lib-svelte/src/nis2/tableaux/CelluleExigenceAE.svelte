<script lang="ts">
  import { type ExigenceAE } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceAE;
</script>

<td>
  <dsfr-tag label={exigence.reference} size="sm"></dsfr-tag>
  <ContenuExigenceFormate {exigence} />
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
  }
</style>
