<script lang="ts">
  import {
    formateContenuExigence,
    type ExigenceComparee,
  } from '../exigence.type';

  export let exigences: ExigenceComparee[];
</script>

<td>
  <div class="exigences">
    {#each exigences as exigenceCorrespondante}
      <div class="exigence-nis2">
        <dsfr-tag label={exigenceCorrespondante.reference}></dsfr-tag>
        <div class="texte-detail-sm">
          {@html formateContenuExigence(exigenceCorrespondante)}
        </div>
      </div>
    {/each}
  </div>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;

    .exigences {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
