<script lang="ts">
  import type { ExigenceNis2 } from '../exigence.type';

  export let exigence: ExigenceNis2;
</script>

<ul>
  {#each exigence.correspondances.ISO.exigences.map((e) => e.contenu) as exigenceCorrespondante (exigenceCorrespondante)}
    <li>{exigenceCorrespondante}</li>
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
