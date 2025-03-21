<script lang="ts">
  import {favorisStore} from "../stores/favoris.store";
</script>


<div class="favoris">
  {#each $favorisStore as favori}

  {:else}
    <div class="contenu-sans-favoris">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Aucun favori sauvegardé"
      />
      <h2>Ajoutez vos ressources cyber favorites et partagez-les facilement avec vos équipes.</h2>
      <a href="/catalogue" class="bouton primaire">Explorer le catalogue</a>
    </div>
  {/each}
</div>

<style>
  .contenu-sans-favoris {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 72px auto 97px;
    max-width: 588px;
  }

  .contenu-sans-favoris h2 {
    text-align: center;
  }
</style>