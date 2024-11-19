<script lang="ts">
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { catalogueFiltre } from "./stores/catalogueFiltre.store";
</script>

<div class="choix-filtre-besoin">
  <label class:actif={!$rechercheParBesoin}>
    <img
      src="/assets/images/illustration-filtre-besoins-tous.svg"
      alt="illustration tous"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value=""
      bind:group={$rechercheParBesoin}
    /> Tous les besoins
  </label>
  <label class:actif={$rechercheParBesoin === "SENSIBILISER_ET_FORMER"}>
    <img
      src="/assets/images/illustration-filtre-besoins-decouvrir-progresser.svg"
      alt="illustration découvrir et progresser"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value="SENSIBILISER_ET_FORMER"
      bind:group={$rechercheParBesoin}
    /> Sensibiliser et former
  </label>
  <label class:actif={$rechercheParBesoin === "RENFORCER_LA_SECURITE"}>
    <img
      src="/assets/images/illustration-filtre-besoins-renforcer-securite.svg"
      alt="illustration renforcer la sécurité"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value="RENFORCER_LA_SECURITE"
      bind:group={$rechercheParBesoin}
    /> Renforcer la sécurité
  </label>
  <label class:actif={$rechercheParBesoin === "REAGIR"}>
    <img
      src="/assets/images/illustration-filtre-besoins-reagir.svg"
      alt="illustration réagir"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value="REAGIR"
      bind:group={$rechercheParBesoin}
    /> Réagir
  </label>
</div>

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
