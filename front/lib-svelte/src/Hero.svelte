<script lang="ts">
  import { profilStore } from './stores/profil.store';

  export let titre: string;
  export let description: string;
  export let ariane: string;
</script>

<section class="chapeau fond-sombre">
  <div class="contenu-section">
    <div class="fil-ariane">
      {#if $profilStore}
        <a href="/catalogue" class="lien">Catalogue des services</a>
      {:else}
        <a href="/" class="lien">Accueil</a>
      {/if}
      <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>
      <span>{ariane}</span>
    </div>
    <h1>{titre}</h1>
    <p>{description}</p>
  </div>
</section>
