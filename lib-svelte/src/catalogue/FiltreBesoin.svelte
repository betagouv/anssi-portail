<script lang="ts">
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { BesoinCyber } from "./Catalogue.types";

  export let filtreTousVisible: boolean = true;
</script>

<div class="choix-filtre-besoin">
  {#if filtreTousVisible}
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
      /> <span>Tous les besoins</span>
    </label>
  {/if}
  <label
    class:actif={$rechercheParBesoin === BesoinCyber.ETRE_SENSIBILISE}
  >
    <img
      src="/assets/images/illustration-filtre-besoins-sensibiliser.svg"
      alt="illustration Être sensibilisé"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.ETRE_SENSIBILISE}
      bind:group={$rechercheParBesoin}
    /> <span>Être sensibilisé</span>
  </label>
  <label
          class:actif={$rechercheParBesoin === BesoinCyber.FORMER}
  >
    <img
            src="/assets/images/illustration-filtre-besoins-former.svg"
            alt="illustration former"
    />
    <input
            type="radio"
            name="filtre-besoin"
            value={BesoinCyber.FORMER}
            bind:group={$rechercheParBesoin}
    /> <span>Former</span>
  </label>
  <label
    class:actif={$rechercheParBesoin === BesoinCyber.RENFORCER_LA_SECURITE}
  >
    <img
      src="/assets/images/illustration-filtre-besoins-renforcer-securite.svg"
      alt="illustration renforcer la sécurité"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.RENFORCER_LA_SECURITE}
      bind:group={$rechercheParBesoin}
    /> <span>Renforcer la sécurité</span>
  </label>
  <label class:actif={$rechercheParBesoin === BesoinCyber.REAGIR}>
    <img
      src="/assets/images/illustration-filtre-besoins-reagir.svg"
      alt="illustration réagir"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.REAGIR}
      bind:group={$rechercheParBesoin}
    /> <span>Réagir</span>
  </label>
</div>
