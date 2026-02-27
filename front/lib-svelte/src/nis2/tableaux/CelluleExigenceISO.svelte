<script lang="ts">
  import type { ExigenceNis2 } from '../exigence.type';

  export let exigence: ExigenceNis2;
</script>

<td>
  <ul>
    {#each exigence.correspondances.ISO.exigences.map((e) => e.contenu) as exigenceCorrespondante (exigenceCorrespondante)}
      <li>{exigenceCorrespondante}</li>
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
