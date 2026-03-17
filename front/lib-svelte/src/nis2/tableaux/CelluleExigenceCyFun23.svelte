<script lang="ts">
  import { badgesExigence, type ExigenceCyFun23 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceCyFun23;
</script>

<dsfr-badges-group badges={badgesExigence(exigence)} size="sm"
></dsfr-badges-group>
<dsfr-tag label={exigence.reference} size="sm"></dsfr-tag>
<ContenuExigenceFormate {exigence} />
