<script lang="ts">
  import type { ItemCyber } from "./Catalogue.types";

  export let services: ItemCyber[];
  export let ressources: ItemCyber[];
</script>

{#each services as service}
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

{#each ressources as ressource}
  - {ressource.nom}
{/each}

<style>
</style>
