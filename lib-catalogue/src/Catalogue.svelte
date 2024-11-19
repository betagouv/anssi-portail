<script lang="ts">
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
  import FiltreBesoin from "./FiltreBesoin.svelte";
  import FiltreAccessibilite from "./FiltreAccessibilite.svelte";
</script>

<FiltreBesoin/>
<FiltreAccessibilite/>

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
      <h3>{service.nom}</h3>
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
