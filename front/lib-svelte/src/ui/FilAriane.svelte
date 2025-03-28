<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';

  export let feuille: string;
  type Branche = {
    nom: string;
    lien: string;
  };
  export let branche: undefined | Branche = undefined;
</script>

<div class="fil-ariane">
  {#if $profilStore}
    <a href="/catalogue" class="lien">Catalogue des services</a>
  {:else}
    <a href="/" class="lien">Accueil</a>
  {/if}
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>

  {#if branche}
    <a href={branche.lien} class="lien">{branche.nom}</a>
    <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  {/if}

  <span>{@html feuille}</span>
</div>

<style>
  .fil-ariane {
    grid-area: ariane;
  }
</style>
