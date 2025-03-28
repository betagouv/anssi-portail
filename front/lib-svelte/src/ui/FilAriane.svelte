<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';

  export let feuille: string;
  type Branche = {
    nom: string;
    lien: string | undefined;
  };
  export let branche: undefined | Branche = undefined;
  export let brancheConnectee: undefined | Branche = undefined;
</script>

<div class="fil-ariane">
  {#if $profilStore}
    <a href="/catalogue" class="lien">Catalogue des services</a>
  {:else}
    <a href="/" class="lien">Accueil</a>
  {/if}
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>

  {#if branche && !$profilStore}
    {#if branche.lien}
      <a href={branche.lien} class="lien">{branche.nom}</a>
    {:else}
      {branche.nom}
    {/if}
    <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  {/if}

  {#if brancheConnectee && $profilStore}
    {#if brancheConnectee.lien}
      <a href={brancheConnectee.lien} class="lien">{brancheConnectee.nom}</a>
    {:else}
      {brancheConnectee.nom}
    {/if}
    <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  {/if}

  <span>{@html feuille}</span>
</div>

<style>
  .fil-ariane {
    grid-area: ariane;
  }
</style>
