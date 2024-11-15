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
      <span></span>
      <a href="/"
        >Découvrir le service
        <img src="/assets/images/icone-fleche-droite.svg" />
      </a>
      <div class="labels">

      </div>
    </div>
  </div>
{/each}

<style>
  main {
    margin: 0;
  }
</style>
