<script lang="ts">
  import { niveauxMaturite } from "./NiveauxMaturite.donnees";
</script>

<ul>
  {#each niveauxMaturite as niveau}
    <li>
      {niveau.label}
    </li>
  {/each}
</ul>
