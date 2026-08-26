<script lang="ts">
  import { type ExigenceAE } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  interface Props {
    exigence: ExigenceAE;
  }

  let { exigence }: Props = $props();
</script>

<dsfr-tag label={exigence.reference} size="sm"></dsfr-tag>
<ContenuExigenceFormate {exigence} />
