<script lang="ts">
  import { rechercheParBesoin } from './stores/rechercheParBesoin.store';
  import { BesoinCyber } from './Catalogue.types';

  export let filtreTousVisible: boolean = true;
</script>

<div class="choix-filtre-besoin">
  {#if filtreTousVisible}
    <label class:actif={!$rechercheParBesoin}>
      <input
        type="radio"
        name="filtre-besoin"
        value=""
        bind:group={$rechercheParBesoin}
      />
      <img
        src="/assets/images/illustration-filtre-besoins-tous.svg"
        alt="Illustration pour pour le filtre sur tous les besoins"
      />
      <span>Tous les besoins</span>
    </label>
  {/if}
  <label class:actif={$rechercheParBesoin === BesoinCyber.ETRE_SENSIBILISE}>
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.ETRE_SENSIBILISE}
      bind:group={$rechercheParBesoin}
    />
    <img
      src="/assets/images/illustration-filtre-besoins-sensibiliser.svg"
      alt="Illustration pour le filtre des besoins Être sensibilisé"
    /><span>Être sensibilisé</span>
  </label>
  <label class:actif={$rechercheParBesoin === BesoinCyber.SE_FORMER}>
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.SE_FORMER}
      bind:group={$rechercheParBesoin}
    />
    <img
      src="/assets/images/illustration-filtre-besoins-former.svg"
      alt="Illustration pour le filtre des besoins Se former"
    /><span>Se former</span>
  </label>
  <label class:actif={$rechercheParBesoin === BesoinCyber.SECURISER}>
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.SECURISER}
      bind:group={$rechercheParBesoin}
    />
    <img
      src="/assets/images/illustration-filtre-besoins-securiser.svg"
      alt="Illustration pour le filtre des besoins Sécuriser"
    /><span>Sécuriser</span>
  </label>
  <label class:actif={$rechercheParBesoin === BesoinCyber.REAGIR}>
    <input
      type="radio"
      name="filtre-besoin"
      value={BesoinCyber.REAGIR}
      bind:group={$rechercheParBesoin}
    />
    <img
      src="/assets/images/illustration-filtre-besoins-reagir.svg"
      alt="Illustration pour le filtre des besoins Réagir"
    /><span>Réagir</span>
  </label>
</div>
