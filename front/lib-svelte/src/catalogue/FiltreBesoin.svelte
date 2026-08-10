<script lang="ts">
  import { rechercheParBesoin } from './stores/rechercheParBesoin.store';
  import { BesoinCyber } from './Catalogue.types';
  import { afficheNouvelleDA } from '$plateforme/environnement';

  export let filtreTousVisible: boolean = true;

  const filtres = [
    ...(filtreTousVisible
      ? [
          {
            libelle: 'Tous les besoins',
            valeur: null,
            icone:
              '<img src="/assets/images/illustration-filtre-besoins-tous-nouvelle-da.svg" alt="" width="56" height="56" />',
          },
        ]
      : []),
    {
      libelle: 'Être sensibilisé',
      valeur: BesoinCyber.ETRE_SENSIBILISE,
      icone:
        '<img src="/assets/images/illustration-filtre-besoins-sensibiliser-nouvelle-da.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Se former',
      valeur: BesoinCyber.SE_FORMER,
      icone:
        '<img src="/assets/images/illustration-filtre-besoins-former-nouvelle-da.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Sécuriser',
      valeur: BesoinCyber.SECURISER,
      icone:
        '<img src="/assets/images/illustration-filtre-besoins-securiser-nouvelle-da.svg" alt="" width="56" height="56" />',
    },
    {
      libelle: 'Réagir',
      valeur: BesoinCyber.REAGIR,
      icone:
        '<img src="/assets/images/illustration-filtre-besoins-reagir-nouvelle-da.svg" alt="" width="56" height="56" />',
    },
  ];
</script>

{#if afficheNouvelleDA}
  <div class="conteneur-filtres">
    <lab-anssi-filtres
      {filtres}
      valeur={$rechercheParBesoin}
      onvaleurachangee={(e: CustomEvent<string>) => ($rechercheParBesoin = (e.detail as BesoinCyber) ?? null)}
    ></lab-anssi-filtres>
  </div>
{:else}
  <div class="choix-filtre-besoin">
    {#if filtreTousVisible}
      <label class:actif={!$rechercheParBesoin}>
        <input type="radio" name="filtre-besoin" value="" bind:group={$rechercheParBesoin} />
        <img
          src="/assets/images/coche-jaune-sur-rond-noir.svg"
          alt="Illustration pour pour le filtre sur tous les besoins"
        />
        <span>Tous les besoins</span>
      </label>
    {/if}
    <label class:actif={$rechercheParBesoin === BesoinCyber.ETRE_SENSIBILISE}>
      <input type="radio" name="filtre-besoin" value={BesoinCyber.ETRE_SENSIBILISE} bind:group={$rechercheParBesoin} />
      <img
        src="/assets/images/illustration-filtre-besoins-sensibiliser.svg"
        alt="Illustration pour le filtre des besoins Être sensibilisé"
      /><span>Être sensibilisé</span>
    </label>
    <label class:actif={$rechercheParBesoin === BesoinCyber.SE_FORMER}>
      <input type="radio" name="filtre-besoin" value={BesoinCyber.SE_FORMER} bind:group={$rechercheParBesoin} />
      <img
        src="/assets/images/illustration-filtre-besoins-former.svg"
        alt="Illustration pour le filtre des besoins Se former"
      /><span>Se former</span>
    </label>
    <label class:actif={$rechercheParBesoin === BesoinCyber.SECURISER}>
      <input type="radio" name="filtre-besoin" value={BesoinCyber.SECURISER} bind:group={$rechercheParBesoin} />
      <img
        src="/assets/images/illustration-filtre-besoins-securiser.svg"
        alt="Illustration pour le filtre des besoins Sécuriser"
      /><span>Sécuriser</span>
    </label>
    <label class:actif={$rechercheParBesoin === BesoinCyber.REAGIR}>
      <input type="radio" name="filtre-besoin" value={BesoinCyber.REAGIR} bind:group={$rechercheParBesoin} />
      <img
        src="/assets/images/illustration-filtre-besoins-reagir.svg"
        alt="Illustration pour le filtre des besoins Réagir"
      /><span>Réagir</span>
    </label>
  </div>
{/if}

<style>
  .conteneur-filtres {
    padding: 24px 0;
  }
</style>
