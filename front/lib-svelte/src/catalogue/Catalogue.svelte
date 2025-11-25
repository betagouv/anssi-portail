<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import ChampRecherche from '../ui/ChampRecherche.svelte';
  import Hero from '../ui/Hero.svelte';
  import CarteItem from './CarteItem.svelte';
  import EnteteFiltres from './EnteteFiltres.svelte';
  import FiltreAccessibilite from './FiltreAccessibilite.svelte';
  import FiltreBesoin from './FiltreBesoin.svelte';
  import FiltreSource from './FiltreSource.svelte';
  import FiltreTypologieEtFormat from './FiltreTypologieEtFormat.svelte';
  import type { Guide } from './Guide.types';
  import FiltreCollection from './guides/FiltreCollection.svelte';
  import FiltreLangue from './guides/FiltreLangue.svelte';
  import { guidePourCarteItem } from './guides/guide';
  import { catalogueFiltre } from './stores/catalogueFiltre.store';
  import { guidesStore } from './stores/guides/guides.store';
  import { guidesFiltres } from './stores/guides/guidesFiltres.store';
  import { recherches } from './stores/recherches.store';
  import { rechercheTextuelle } from './stores/rechercheTextuelle.store';

  const { featureFlagGuides }: { featureFlagGuides: boolean } = $props();

  const reinitialiseFiltres = () => recherches.reinitialise();
  let chargement = $state(false);

  let modeAffichage = $state<'guides' | 'ressourcesEtServices'>(
    window.location.hash === '#guides' ? 'guides' : 'ressourcesEtServices'
  );

  const afficheLesServicesEtRessources = () => {
    modeAffichage = 'ressourcesEtServices';
    window.location.hash = '#ressourcesEtServices';
  };
  const afficheLesGuides = () => {
    modeAffichage = 'guides';
    window.location.hash = '#guides';
  };

  onMount(async () => {
    try {
      chargement = true;
      const reponse = await axios.get<Guide[]>('/api/guides');
      const guides = reponse.data.map(guidePourCarteItem);
      guidesStore.initialise(guides);
    } finally {
      chargement = false;
    }
  });
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

{#if featureFlagGuides}
  <div class="controle-segmente">
    <button
      class="bouton-segmente"
      class:actif={modeAffichage === 'ressourcesEtServices'}
      onclick={afficheLesServicesEtRessources}
    >
      <lab-anssi-icone nom="list-check"></lab-anssi-icone>
      <span>Services et outils</span>
    </button>
    <button
      class="bouton-segmente"
      class:actif={modeAffichage === 'guides'}
      onclick={afficheLesGuides}
    >
      <lab-anssi-icone nom="book-2-line"></lab-anssi-icone>
      <span>Guides de l'ANSSI</span>
    </button>
  </div>
{/if}

<div class="contenu-catalogue">
  <div class="contenu-section">
    <div class="grille">
      <div class="sommaire sommaire-deplie">
        <ChampRecherche bind:recherche={$rechercheTextuelle} />
        <EnteteFiltres />
        <div class="barre-filtres">
          {#if modeAffichage === 'guides'}
            <FiltreLangue />
            <FiltreCollection />
          {:else}
            <FiltreAccessibilite />
            <FiltreTypologieEtFormat />
            <FiltreSource />
          {/if}
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            onclick={reinitialiseFiltres}
          />
        </div>
      </div>

      {#if modeAffichage === 'guides'}
        {#each $guidesFiltres.resultats as guide (guide.id)}
          <CarteItem item={guide} avecBoutonFavori />
        {:else}
          <div class="aucun-resultat">
            <img
              src="/assets/images/illustration-aucun-resultat.svg"
              alt="Aucun résultat"
            />
            {#if chargement}
              <h1>Chargement...</h1>
            {:else}
              <h1>Désolé, aucun résultat trouvé</h1>
            {/if}
            <input
              type="button"
              class="bouton primaire"
              value="Réinitialiser les filtres"
              onclick={reinitialiseFiltres}
            />
          </div>
        {/each}
      {:else}
        {#each $catalogueFiltre.resultats as itemCyber (itemCyber.id)}
          <CarteItem item={itemCyber} avecBoutonFavori />
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
      {/if}
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
