<script lang="ts">
  export let filtreActif: boolean;
</script>

<div class="entete-filtres">
  {#if filtreActif}
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
