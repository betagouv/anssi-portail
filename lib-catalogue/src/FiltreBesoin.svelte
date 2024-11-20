<script lang="ts">
  import { rechercheParBesoin } from "./stores/rechercheParBesoin.store";
  import { BesoinCyber } from "./Catalogue.types";
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
  <label
    class:actif={$rechercheParBesoin === BesoinCyber.SENSIBILISER_ET_FORMER}
  >
    <img
      src="/assets/images/illustration-filtre-besoins-decouvrir-progresser.svg"
      alt="illustration découvrir et progresser"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.SENSIBILISER_ET_FORMER}
      bind:group={$rechercheParBesoin}
    /> Sensibiliser et former
  </label>
  <label class:actif={$rechercheParBesoin === BesoinCyber.RENFORCER_LA_SECURITE}>
    <img
      src="/assets/images/illustration-filtre-besoins-renforcer-securite.svg"
      alt="illustration renforcer la sécurité"
    />
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.RENFORCER_LA_SECURITE}
      bind:group={$rechercheParBesoin}
    /> Renforcer la sécurité
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
    /> Réagir
  </label>
</div>
