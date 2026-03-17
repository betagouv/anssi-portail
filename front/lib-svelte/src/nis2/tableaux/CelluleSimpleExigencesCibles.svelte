<script lang="ts">
  import {
    formateContenuExigence,
    type ExigenceComparee,
  } from '../exigence.type';

  export let exigences: ExigenceComparee[];
</script>

<div class="exigences">
  {#each exigences as exigenceCorrespondante (exigenceCorrespondante.reference)}
    <div class="exigence-nis2">
      <dsfr-tag label={exigenceCorrespondante.reference} size="sm"></dsfr-tag>
      <div class="texte-detail-sm">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html formateContenuExigence(exigenceCorrespondante)}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .exigences {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
