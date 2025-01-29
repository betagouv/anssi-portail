<script lang="ts">
  import {niveauxMaturite} from "../test-maturite/TestMaturite.donnees";
</script>
<ul>
  {#each niveauxMaturite as niveau}
  <li>
    {niveau.label}
  </li>
    {/each}
</ul>