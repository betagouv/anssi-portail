<script lang="ts">
  import { itemsCatalogueEnFavori } from '../catalogue/stores/itemsCatalogueEnFavori';
  import ContenuFavoris from './ContenuFavoris.svelte';
</script>

<section class="chapeau fond-sombre">
  <div class="contenu-section">
    <h1>Services et ressources favoris</h1>
    <p>Retrouvez tous vos contenus cyber à partager.</p>
    <div class="cta">
      <p>Parcourez le catalogue pour ajouter plus de services et ressources.</p>
      <a href="/catalogue/" class="bouton primaire">Explorer le catalogue</a>
    </div>
  </div>
</section>

<section>
  <div class="contenu-section">
    <div class="favoris">
      {#if $itemsCatalogueEnFavori.length === 0}
        <div class="contenu-sans-favoris">
          <img
            src="/assets/images/illustration-dragon-aucun-resultat.svg"
            alt="Aucun favori sauvegardé"
          />
          <h2>
            Ajoutez vos ressources cyber favorites et partagez-les facilement
            avec vos équipes.
          </h2>
          <a href="/catalogue" class="bouton primaire">Explorer le catalogue</a>
        </div>
      {:else}
        <ContenuFavoris
          avecBoutonFavori
          itemsEnFavori={$itemsCatalogueEnFavori}
        />
      {/if}
    </div>
  </div>
</section>
