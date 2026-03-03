<script lang="ts">
  import type { ExigenceComparee } from '../exigence.type';

  export let exigences: ExigenceComparee[];
</script>

<td>
  <ul>
    {#each exigences as exigenceCorrespondante (exigenceCorrespondante.reference)}
      <li>{exigenceCorrespondante.reference}</li>
    {/each}
  </ul>
</td>

<style lang="scss">
  td {
    padding: 0.5rem 1rem;
    border: 1px solid black;
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
  }
</style>
