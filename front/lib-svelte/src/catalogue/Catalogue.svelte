<script lang="ts">
  import { onMount } from 'svelte';
  import ControleSegmente from '../navigation/ControleSegmente.svelte';
  import { creeLeFragmentDeNavigation, type FragmentDeNavigation } from '../navigation/fragmentDeNavigation';
  import { profilStore } from '../stores/profil.store';
  import ChampRecherche from '../ui/ChampRecherche.svelte';
  import FiltresBureau from '../ui/FiltresBureau.svelte';
  import FiltresMobile from '../ui/FiltresMobile.svelte';
  import Hero from '../ui/Hero.svelte';
  import CarteItem from './CarteItem.svelte';
  import { type BesoinCyber, DroitAcces, Source, Typologie } from './Catalogue.types';
  import FiltreAccessibilite from './FiltreAccessibilite.svelte';
  import FiltreBesoin from './FiltreBesoin.svelte';
  import FiltreSource from './FiltreSource.svelte';
  import FiltreTypologie from './FiltreTypologie.svelte';
  import { CollectionGuide, Langue } from './Guide.types';
  import FiltreCollection from './guides/FiltreCollection.svelte';
  import FiltreLangue from './guides/FiltreLangue.svelte';
  import InciteASAbonner from './guides/InciteASAbonner.svelte';
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

  const idsCollectionsGuide: Record<CollectionGuide, string> = {
    [CollectionGuide.LES_ESSENTIELS]: 'essentiels',
    [CollectionGuide.LES_FONDAMENTAUX]: 'fondamentaux',
    [CollectionGuide.IA]: 'ia',
    [CollectionGuide.CRYPTOGRAPHIE]: 'cryptographie',
    [CollectionGuide.SYSTEMES_INDUSTRIELS]: 'systemes-industriels',
    [CollectionGuide.CRISE_CYBER]: 'crise-cyber',
    [CollectionGuide.GESTION_DES_RISQUES_CYBER]: 'gestion-risques-cyber',
    [CollectionGuide.SUPERVISION_DE_SECURITE]: 'supervision-securite',
    [CollectionGuide.REMEDIATION]: 'remediation',
    [CollectionGuide.AUTRE]: 'autre',
  };
  const nomsCollectionsGuide = Object.fromEntries(
    Object.entries(idsCollectionsGuide).map(([cle, valeur]) => [valeur, cle as CollectionGuide])
  );
  const versIdsCollection = (collections: CollectionGuide[]): string[] =>
    collections.map((c) => idsCollectionsGuide[c]);

  const depuisIdsCollection = (idsCollection: string[]): CollectionGuide[] =>
    idsCollection.map((i) => nomsCollectionsGuide[i]);

  // Gestion du fragment
  let fragmentDeNavigation = $state(creeLeFragmentDeNavigation(window.location.hash));

  // Gestion de la section
  type Section = 'guides' | 'ressourcesEtServices';
  let sectionActive = $derived<Section>('guides');
  let indexActif = $derived(sectionActive === 'guides' ? 0 : 1);
  $effect(() => {
    sectionActive = indexActif === 0 ? 'guides' : 'ressourcesEtServices';
  });

  // Gestion des filtres
  const reinitialiseFiltres = () => recherches.reinitialise();
  const appliqueLesFiltres = (fragmentDeNavigation: FragmentDeNavigation) => {
    $rechercheParBesoin = fragmentDeNavigation.extraisValeur<BesoinCyber>('besoin', null);
    $rechercheParLangue = fragmentDeNavigation.extraisTableau<Langue>('langues');
    $rechercheParCollection = depuisIdsCollection(fragmentDeNavigation.extraisTableau<CollectionGuide>('collections'));
    $rechercheTextuelle = fragmentDeNavigation.extraisValeur('q', '');
    $rechercheParDroitAcces = fragmentDeNavigation.extraisTableau<DroitAcces>('accessibilite');
    $rechercheParTypologie = fragmentDeNavigation.extraisTableau<Typologie>('types');
    $rechercheParSource = fragmentDeNavigation.extraisTableau<Source>('sources');
  };
  appliqueLesFiltres(fragmentDeNavigation);
  $effect(() => {
    fragmentDeNavigation.change('besoin', $rechercheParBesoin);
    fragmentDeNavigation.change('langues', $rechercheParLangue);
    fragmentDeNavigation.change('collections', versIdsCollection($rechercheParCollection));
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

  <input type="button" class="bouton primaire" value="Réinitialiser les filtres" onclick={reinitialiseFiltres} />
</FiltresMobile>

<dsfr-container class="barre-recherche-mobile">
  <ChampRecherche bind:recherche={$rechercheTextuelle} />
</dsfr-container>

<ControleSegmente
  elements={[
    { id: 'guides', titre: 'Guides de l’ANSSI', icone: 'book-2-line', ancre: 'guides' },
    { id: 'ressources-et-services', titre: 'Services et outils', icone: 'list-check', ancre: 'ressourcesEtServices' },
  ]}
  bind:indexActif
  {fragmentDeNavigation}
  lorsDuChangement={appliqueLesFiltres}
></ControleSegmente>

<dsfr-container class="contenu-catalogue">
  {#if !$profilStore && sectionActive === 'guides'}
    <div class="entete">
      <InciteASAbonner />
    </div>
  {/if}

  <div class="grille">
    <FiltresBureau filtreActif={$recherches.filtreActif}>
      <ChampRecherche slot="avant-entete" bind:recherche={$rechercheTextuelle} />
      {#if sectionActive === 'guides'}
        <FiltreLangue />
        <FiltreCollection />
      {:else}
        <FiltreAccessibilite />
        <FiltreTypologie />
        <FiltreSource />
      {/if}
      <input type="button" class="bouton primaire" value="Réinitialiser les filtres" onclick={reinitialiseFiltres} />
    </FiltresBureau>

    {#if sectionActive === 'guides'}
      {#each $guidesFiltres.resultats as guide (guide.id)}
        <CarteItem item={guide} avecBoutonFavori />
      {:else}
        <div class="aucun-resultat">
          <img src="/assets/images/homme-cherchant-avec-loupe.svg" alt="Aucun résultat" />
          {#if chargement}
            <p class="fr-h3">Chargement...</p>
          {:else}
            <p class="fr-h3">Désolé, aucun résultat trouvé</p>
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
          <img src="/assets/images/homme-cherchant-avec-loupe.svg" alt="Aucun résultat" />
          <p class="fr-h3">Désolé, aucun résultat trouvé</p>
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
</dsfr-container>

<style lang="scss">
  .contenu-section {
    flex-direction: column;
  }

  .entete {
    padding-bottom: 0.5rem;
  }
</style>
