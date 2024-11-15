<script lang="ts">
  import type { Service } from "./Catalogue.types";

  export let services: Service[];
</script>

{#each services as service}
  <div class="carte service">
    <figure>
      <img src="/assets/images/illustrations-services/{service.illustration}" />
      <figcaption>Service</figcaption>
    </figure>
    <div class="contenu">
      <h3>{service.nom}</h3>
      <span>{@html service.description}</span>
      <a href={service.lienInterne}>
        En savoir plus
        <img src="/assets/images/icone-fleche-droite.svg" />
      </a>
      <div class="labels">
        {#each service.sources as source}<span>{source}</span>{/each}
      </div>
    </div>
  </div>
{/each}

<style>
  main {
    margin: 0;
  }
</style>
