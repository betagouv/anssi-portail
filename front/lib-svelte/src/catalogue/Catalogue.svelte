<script lang="ts">
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import ChampRecherche from '../ui/ChampRecherche.svelte';
  import Hero from '../ui/Hero.svelte';
  import CarteItem from './CarteItem.svelte';
  import {
    type BesoinCyber,
    DroitAcces,
    Source,
    Typologie,
  } from './Catalogue.types';
  import FiltreAccessibilite from './FiltreAccessibilite.svelte';
  import FiltreBesoin from './FiltreBesoin.svelte';
  import FiltreSource from './FiltreSource.svelte';
  import FiltreTypologie from './FiltreTypologie.svelte';
  import { creeLeFragmentDeNavigation } from './fragmentDeNavigation';
  import { CollectionGuide, Langue } from './Guide.types';
  import FiltreCollection from './guides/FiltreCollection.svelte';
  import FiltreLangue from './guides/FiltreLangue.svelte';
  import { catalogueFiltre } from './stores/catalogueFiltre.store';
  import { chargeGuidesDansLeStore } from './stores/guides/guides.store';
  import { guidesFiltres } from './stores/guides/guidesFiltres.store';
  import { rechercheParCollection } from './stores/guides/rechercheParCollection.store';
  import { rechercheParLangue } from './stores/guides/rechercheParLangue.store';
  import { rechercheParBesoin } from './stores/rechercheParBesoin.store';
  import { rechercheParDroitAcces } from './stores/rechercheParDroitAcces.store';
  import { rechercheParSource } from './stores/rechercheParSource.store';
  import { rechercheParTypologie } from './stores/rechercheParTypologie.store';
  import { recherches } from './stores/recherches.store';
  import { rechercheTextuelle } from './stores/rechercheTextuelle.store';
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import FiltresBureau from '../ui/FiltresBureau.svelte';

  const { featureFlagGuides }: { featureFlagGuides: boolean } = $props();

  const idsCollectionsGuide: Record<CollectionGuide, string> = {
    [CollectionGuide.LES_ESSENTIELS]: 'essentiels',
    [CollectionGuide.LES_FONDAMENTAUX]: 'fondamentaux',
    [CollectionGuide.CRISE_CYBER]: 'crise-cyber',
    [CollectionGuide.GESTION_DES_RISQUES_CYBER]: 'gestion-risques-cyber',
    [CollectionGuide.SUPERVISION_DE_SECURITE]: 'supervision-securite',
    [CollectionGuide.REMEDIATION]: 'remediation',
    [CollectionGuide.AUTRE]: 'autre',
  };
  const nomsCollectionsGuide = Object.fromEntries(
    Object.entries(idsCollectionsGuide).map(([cle, valeur]) => [
      valeur,
      cle as CollectionGuide,
    ])
  );
  const versIdsCollection = (collections: CollectionGuide[]): string[] =>
    collections.map((c) => idsCollectionsGuide[c]);

  const depuisIdsCollection = (idsCollection: string[]): CollectionGuide[] =>
    idsCollection.map((i) => nomsCollectionsGuide[i]);

  // Gestion du fragment
  let fragmentDeNavigation = $state(
    creeLeFragmentDeNavigation(window.location.hash)
  );
  const changeLeFragmentDeNavigation = () => {
    fragmentDeNavigation = creeLeFragmentDeNavigation(window.location.hash);
    appliqueLesFiltres();
  };
  $effect(() => {
    window.addEventListener('hashchange', changeLeFragmentDeNavigation);
    return () => {
      window.removeEventListener('hashchange', changeLeFragmentDeNavigation);
    };
  });

  // Gestion de la section
  type Section = 'guides' | 'ressourcesEtServices';
  let sectionActive = $derived<Section>(
    fragmentDeNavigation.section === 'guides'
      ? 'guides'
      : 'ressourcesEtServices'
  );
  const changeDeSection = (section: Section) => {
    sectionActive = section;
    fragmentDeNavigation.changeSection(section);
    window.location.hash = fragmentDeNavigation.serialise();
  };

  // Gestion des filtres
  const reinitialiseFiltres = () => recherches.reinitialise();
  const appliqueLesFiltres = () => {
    $rechercheParBesoin = fragmentDeNavigation.extraisValeur<BesoinCyber>(
      'besoin',
      null
    );
    $rechercheParLangue =
      fragmentDeNavigation.extraisTableau<Langue>('langues');
    $rechercheParCollection = depuisIdsCollection(
      fragmentDeNavigation.extraisTableau<CollectionGuide>('collections')
    );
    $rechercheTextuelle = fragmentDeNavigation.extraisValeur('q', '');
    $rechercheParDroitAcces =
      fragmentDeNavigation.extraisTableau<DroitAcces>('accessibilite');
    $rechercheParTypologie =
      fragmentDeNavigation.extraisTableau<Typologie>('types');
    $rechercheParSource =
      fragmentDeNavigation.extraisTableau<Source>('sources');
  };
  appliqueLesFiltres();
  $effect(() => {
    fragmentDeNavigation.change('besoin', $rechercheParBesoin);
    fragmentDeNavigation.change('langues', $rechercheParLangue);
    fragmentDeNavigation.change(
      'collections',
      versIdsCollection($rechercheParCollection)
    );
    fragmentDeNavigation.change('q', $rechercheTextuelle);
    fragmentDeNavigation.change('accessibilite', $rechercheParDroitAcces);
    fragmentDeNavigation.change('types', $rechercheParTypologie);
    fragmentDeNavigation.change('sources', $rechercheParSource);
    window.location.hash = fragmentDeNavigation.serialise();
  });

  // Gestion du chargement
  let chargement = $state(false);
  onMount(async () => {
    try {
      chargement = true;
      await chargeGuidesDansLeStore();
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

<FiltresMobile filtreActif={$recherches.filtreActif}>
  <FiltreBesoin />
  {#if sectionActive === 'guides'}
    <FiltreLangue />
    <FiltreCollection />
  {:else}
    <FiltreAccessibilite />
    <FiltreTypologie />
    <FiltreSource />
  {/if}

  <input
    type="button"
    class="bouton primaire"
    value="Réinitialiser les filtres"
    onclick={reinitialiseFiltres}
  />
</FiltresMobile>

<section class="barre-recherche-mobile">
  <div class="contenu-section">
    <ChampRecherche bind:recherche={$rechercheTextuelle} />
  </div>
</section>

{#if featureFlagGuides}
  <div class="controle-segmente">
    <button
      class="bouton-segmente"
      class:actif={sectionActive === 'ressourcesEtServices'}
      onclick={() => changeDeSection('ressourcesEtServices')}
    >
      <lab-anssi-icone nom="list-check"></lab-anssi-icone>
      <span>Services et outils</span>
    </button>
    <button
      class="bouton-segmente"
      class:actif={sectionActive === 'guides'}
      onclick={() => changeDeSection('guides')}
    >
      <lab-anssi-icone nom="book-2-line"></lab-anssi-icone>
      <span>Guides de l'ANSSI</span>
    </button>
  </div>
{/if}

<div class="contenu-catalogue">
  <div class="contenu-section">
    <div class="grille">
      <FiltresBureau filtreActif={$recherches.filtreActif}>
        <ChampRecherche
          slot="avant-entete"
          bind:recherche={$rechercheTextuelle}
        />
        {#if sectionActive === 'guides'}
          <FiltreLangue />
          <FiltreCollection />
        {:else}
          <FiltreAccessibilite />
          <FiltreTypologie />
          <FiltreSource />
        {/if}
        <input
          type="button"
          class="bouton primaire"
          value="Réinitialiser les filtres"
          onclick={reinitialiseFiltres}
        />
      </FiltresBureau>

      {#if sectionActive === 'guides'}
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
              <input
                type="button"
                class="bouton primaire"
                value="Réinitialiser les filtres"
                onclick={reinitialiseFiltres}
              />
            {/if}
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
