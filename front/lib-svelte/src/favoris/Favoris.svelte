<script lang="ts">
  import {itemsCatalogueEnFavori} from "../catalogue/stores/itemsCatalogueEnFavori";
  import CarteItem from "../catalogue/CarteItem.svelte";
</script>

<div class="favoris">
  {#if $itemsCatalogueEnFavori.length === 0}
    <div class="contenu-sans-favoris">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Aucun favori sauvegardé"
      />
      <h2>Ajoutez vos ressources cyber favorites et partagez-les facilement avec vos équipes.</h2>
      <a href="/catalogue" class="bouton primaire">Explorer le catalogue</a>
    </div>
  {:else}
    <div class="grille">
      {#each $itemsCatalogueEnFavori as itemCyber}
        <CarteItem {itemCyber} avecBoutonFavori/>
      {/each}
    </div>
  {/if}
</div>