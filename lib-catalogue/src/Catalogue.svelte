<script lang="ts">
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import FiltreAccessibilite from "./FiltreAccessibilite.svelte";
  import FiltreTypologieEtFormat from "./FiltreTypologieEtFormat.svelte";
  import FiltreSource from "./FiltreSource.svelte";
  import FiltreTheme from "./FiltreTheme.svelte";
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { rechercheParDroitAcces } from "./stores/rechercheParDroitAcces.store";
  import { rechercheParTypologie } from "./stores/rechercheParTypologie.store";
  import { rechercheParFormat } from "./stores/rechercheParFormat.store";
  import { rechercheParSource } from "./stores/rechercheParSource.store";
  import { rechercheParTheme } from "./stores/rechercheParTheme.store";

  const reinitialiseFiltres = () => {
    rechercheParBesoin.reinitialise();
    rechercheParDroitAcces.reinitialise();
    rechercheParTypologie.reinitialise();
    rechercheParFormat.reinitialise();
    rechercheParSource.reinitialise();
    rechercheParTheme.reinitialise();
  };
</script>

<FiltreBesoin />
<FiltreAccessibilite />
<FiltreTypologieEtFormat />
<FiltreSource />
<FiltreTheme />
<input
  type="button"
  class="bouton primaire"
  value="Réinitialiser les filtres"
  on:click={reinitialiseFiltres}
/>

{#each $catalogueFiltre.resultats as service}
  <div class="carte service">
    <figure>
      <img
        src="/assets/images/illustrations-services/{service.illustration}"
        alt="Illustration du service"
      />
      <figcaption>Service</figcaption>
    </figure>
    <div class="contenu">
      <h3>{@html service.nom}</h3>
      <span>{@html service.description}</span>
      <a href={service.lienInterne}>
        En savoir plus
        <img
          src="/assets/images/icone-fleche-droite.svg"
          alt="En savoir plus"
        />
      </a>
      <div class="labels">
        {#each service.sources as source}<span>{source}</span>{/each}
      </div>
    </div>
  </div>
{/each}

<style>
</style>
