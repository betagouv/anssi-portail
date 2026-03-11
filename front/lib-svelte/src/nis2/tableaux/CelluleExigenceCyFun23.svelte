<script lang="ts">
  import {
    formateContenuExigence,
    type ExigenceCyFun23,
  } from '../exigence.type';

  export let exigence: ExigenceCyFun23;
</script>

<td>
  <dsfr-tag label={exigence.reference}></dsfr-tag>
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
      margin: 8px 0 0;

      :global(p) {
        margin: 0;
      }
    }
  }
</style>
