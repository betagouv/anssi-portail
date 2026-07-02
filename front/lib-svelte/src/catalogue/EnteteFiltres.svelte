<script lang="ts">
  export let filtreActif: boolean;
</script>

<div class="entete-filtres">
  {#if filtreActif}
    <img class="menu" src="/assets/images/icone-filtre-plein.svg" width="16" height="16" alt="Icône filtre" />
  {:else}
    <img class="menu" src="/assets/images/icone-filtre-vide.svg" width="16" height="16" alt="Icône filtre" />
  {/if}
  <span class="titre-menu">Filtres</span>
  <img class="chevron" src="/assets/images/icone-chevron-bas.svg" width="16" height="16" alt="Chevron ouverture" />
</div>
