<script lang="ts">
  import { recherches } from "./stores/recherches.store.js";
</script>

<div class="entete-filtres">
  {#if $recherches.filtreActif}
    <img
      class="menu"
      src="/assets/images/icone-filtre-plein.svg"
      alt="Icône filtre"
    />
  {:else}
    <img
      class="menu"
      src="/assets/images/icone-filtre-vide.svg"
      alt="Icône filtre"
    />
  {/if}
  <span class="titre-menu">Filtres</span>
  <img
    class="chevron"
    src="/assets/images/icone-chevron-bas.svg"
    alt="Chevron ouverture"
  />
</div>
