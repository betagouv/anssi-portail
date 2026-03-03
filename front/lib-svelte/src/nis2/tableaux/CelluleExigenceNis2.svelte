<script lang="ts">
  import {
    badgesExigence,
    formateContenuExigence,
    type ExigenceNis2,
  } from '../exigence.type';

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
  <div class="texte-detail-sm">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html formateContenuExigence(exigence)}
  </div>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
    .texte-detail-sm {
      margin-bottom: 0;
    }
  }
</style>
