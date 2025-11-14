<script lang="ts">
  import { catalogueFiltre } from './stores/catalogueFiltre.store';
  import FiltreBesoin from './FiltreBesoin.svelte';
  import FiltreAccessibilite from './FiltreAccessibilite.svelte';
  import FiltreTypologieEtFormat from './FiltreTypologieEtFormat.svelte';
  import FiltreSource from './FiltreSource.svelte';
  import { recherches } from './stores/recherches.store';
  import CarteItem from './CarteItem.svelte';
  import EnteteFiltres from './EnteteFiltres.svelte';
  import Hero from '../ui/Hero.svelte';
  import { profilStore } from '../stores/profil.store';
  import ChampRecherche from '../ui/ChampRecherche.svelte';
  import { rechercheTextuelle } from './stores/rechercheTextuelle.store';

  const reinitialiseFiltres = () => recherches.reinitialise();

  let afficheLesGuides = $state(false);
  const changeAffichage = () => {
    afficheLesGuides = !afficheLesGuides;
  };
</script>

<Hero
  titre="Les services et ressources cyber"
  description="Trouvez les services et les ressources adaptés à vos besoins."
  ariane={$profilStore ? undefined : 'Explorer le catalogue'}
/>

<div class="barre-filtre-besoin">
  <div class="contenu-section">
    <FiltreBesoin />
  </div>
</div>

<div class="sommaire sommaire-replie">
  <details>
    <summary>
      <EnteteFiltres />
    </summary>

    <div class="barre-filtres">
      <FiltreBesoin />
      <FiltreAccessibilite />
      <FiltreTypologieEtFormat />
      <FiltreSource />
      <input
        type="button"
        class="bouton primaire"
        value="Réinitialiser les filtres"
        onclick={reinitialiseFiltres}
      />
    </div>
  </details>
</div>

<section class="barre-recherche-mobile">
  <div class="contenu-section">
    <ChampRecherche bind:recherche={$rechercheTextuelle} />
  </div>
</section>

<div class="controle-segmente">
  <button
    class="bouton-segmente"
    class:actif={!afficheLesGuides}
    onclick={changeAffichage}
  >
    <lab-anssi-icone nom="list-check"></lab-anssi-icone>
    <span>Services et outils</span>
  </button>
  <button
    class="bouton-segmente"
    class:actif={afficheLesGuides}
    onclick={changeAffichage}
  >
    <lab-anssi-icone nom="book-2-line"></lab-anssi-icone>
    <span>Guides de l'ANSSI</span>
  </button>
</div>

<div class="contenu-catalogue">
  <div class="contenu-section">
    <div class="grille">
      <div class="sommaire sommaire-deplie">
        <ChampRecherche bind:recherche={$rechercheTextuelle} />
        <EnteteFiltres />
        <div class="barre-filtres">
          <FiltreAccessibilite />
          <FiltreTypologieEtFormat />
          <FiltreSource />
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            onclick={reinitialiseFiltres}
          />
        </div>
      </div>

      {#each $catalogueFiltre.resultats as itemCyber (itemCyber.id)}
        <CarteItem {itemCyber} avecBoutonFavori />
      {:else}
        <div class="aucun-resultat">
          <img
            src="/assets/images/illustration-aucun-resultat.svg"
            alt="Aucun résultat"
          />
          <h1>Désolé, aucun résultat trouvé</h1>
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            onclick={reinitialiseFiltres}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .controle-segmente {
    margin: 3rem auto 1rem;
    width: min-content;

    .bouton-segmente {
      padding: 0.5rem 1rem 0.5rem 0.75rem;

      lab-anssi-icone {
        margin-right: 0.5rem;
      }
    }
  }
</style>
