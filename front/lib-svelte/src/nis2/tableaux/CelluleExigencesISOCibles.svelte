<script lang="ts">
  import type { ExigenceComparee } from '../exigence.type';

  export let exigences: ExigenceComparee[];
</script>

<ul class="texte-detail-sm">
  {#each exigences as exigenceCorrespondante (exigenceCorrespondante.reference)}
    <li>{exigenceCorrespondante.reference}</li>
  {/each}
</ul>

<style lang="scss">
  ul {
    padding-left: 0;
    margin: 0;
    list-style: none;

    li {
      padding-left: 20px;
      position: relative;

      &::before {
        position: absolute;
        left: 0;
        content: '\2192';
      }
    }
  }
</style>
