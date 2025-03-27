<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  export let ariane: string;
</script>
<div class="fil-ariane">
  {#if $profilStore}
    <a href="/catalogue" class="lien">Catalogue des services</a>
  {:else}
    <a href="/" class="lien">Accueil</a>
  {/if}
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>
  <span>{ariane}</span>
</div>

<style>
  .fil-ariane {
      grid-area: ariane;
  }
</style>