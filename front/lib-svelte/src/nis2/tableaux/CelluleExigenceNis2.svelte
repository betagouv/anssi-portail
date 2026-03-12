<script lang="ts">
  import { badgesExigence, type ExigenceNis2 } from '../exigence.type';
  import ContenuExigenceFormate from './ContenuExigenceFormate.svelte';

  export let exigence: ExigenceNis2;
</script>

<td>
  <dsfr-badges-group badges={badgesExigence(exigence)}></dsfr-badges-group>
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
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
  }
</style>
