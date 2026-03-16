<script lang="ts">
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceNis2;
</script>

<dsfr-badges-group badges={badgesExigence(exigence)} size="sm"
></dsfr-badges-group>
<dsfr-tags-group
  tags={[
    ...(exigence.objectifSecurite
      ? [{ label: exigence.objectifSecurite }]
      : []),
    { label: exigence.thematique },
    { label: exigence.reference },
  ]}
  size="sm"
  groupMarkup="div"
></dsfr-tags-group>
<ContenuExigenceFormate {exigence} />
