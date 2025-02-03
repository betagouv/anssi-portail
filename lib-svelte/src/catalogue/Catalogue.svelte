<script lang="ts">
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import FiltreAccessibilite from "./FiltreAccessibilite.svelte";
  import FiltreTypologieEtFormat from "./FiltreTypologieEtFormat.svelte";
  import FiltreSource from "./FiltreSource.svelte";
  import { recherches } from "./stores/recherches.store";
  import CarteItem from "./CarteItem.svelte";
  import EnteteFiltres from "./EnteteFiltres.svelte";

  const reinitialiseFiltres = () => recherches.reinitialise();
</script>

<div class="barre-filtre-besoin">
  <div class="contenu-section">
    <FiltreBesoin />
  </div>
</div>

<div class="sommaire sommaire-replie">
  <details>
    <summary>
      <EnteteFiltres />
    </summary>

    <div class="barre-filtres">
      <FiltreBesoin />
      <FiltreAccessibilite />
      <FiltreTypologieEtFormat />
      <FiltreSource />
      <input
        type="button"
        class="bouton primaire"
        value="Réinitialiser les filtres"
        on:click={reinitialiseFiltres}
      />
    </div>
  </details>
</div>

<div class="recherche">
  <div class="contenu-section">
    <div class="grille">
      <div class="sommaire sommaire-deplie">
        <EnteteFiltres />
        <div class="barre-filtres">
          <FiltreAccessibilite />
          <FiltreTypologieEtFormat />
          <FiltreSource />
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            on:click={reinitialiseFiltres}
          />
        </div>
      </div>

      {#each $catalogueFiltre.resultats as itemCyber}
        <CarteItem {itemCyber} />
      {:else}
        <div class="aucun-resultat">
          <img
            src="/assets/images/illustration-aucun-resultat.svg"
            alt="Aucun résultat"
          />
          <h1>Désolé, aucun résultat trouvé</h1>
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            on:click={reinitialiseFiltres}
          />
        </div>
      {/each}
    </div>
  </div>
</div>
