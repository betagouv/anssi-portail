<script lang="ts">
  /**
   * CatalogueInteractif.svelte
   *
   * Rendu SSG : affiche les cartes sans filtres (HTML statique, pas de JS).
   * Rendu client (après hydratation client:load) : active tous les filtres,
   * la recherche textuelle et la persistance de l'état dans le hash de l'URL.
   *
   * Props
   * ─────
   * guidesJson     – sérialisation JSON du tableau Guide[] produit par Astro
   * ressourcesJson – sérialisation JSON du tableau ItemCyber[] produit par Astro
   */

  import { onMount } from 'svelte';
  import CarteItem from '../../../front/lib-svelte/src/catalogue/CarteItem.svelte';
  import {
    DroitAcces,
    Source,
    Typologie,
    type BesoinCyber,
  } from '../../../front/lib-svelte/src/catalogue/Catalogue.types';
  import { CollectionGuide, Langue, type Guide } from '../../../front/lib-svelte/src/catalogue/Guide.types';
  import ControleSegmente from '../../../front/lib-svelte/src/navigation/ControleSegmente.svelte';
  import {
    creeLeFragmentDeNavigation,
    type FragmentDeNavigation,
  } from '../../../front/lib-svelte/src/navigation/fragmentDeNavigation';
  //import { profilStore } from '../../../front/lib-svelte/src/stores/profil.store';
  import ChampRecherche from '../../../front/lib-svelte/src/ui/ChampRecherche.svelte';
  import FiltresBureau from '../../../front/lib-svelte/src/ui/FiltresBureau.svelte';
  import FiltresMobile from '../../../front/lib-svelte/src/ui/FiltresMobile.svelte';

  // ─── Props ─────────────────────────────────────────────────────────────────────

  interface Props {
    guides: string;
  }
  const { guides: guidesJson }: Props = $props();
  const guides: Guide[] = JSON.parse(guidesJson);

  // ─── État des filtres ──────────────────────────────────────────────────────────

  let rechercheTextuelle = $state('');
  let rechercheParBesoin = $state<BesoinCyber | null>(null);
  let rechercheParLangue = $state<Langue[]>([]);
  let rechercheParCollection = $state<CollectionGuide[]>([]);
  let rechercheParDroitAcces = $state<DroitAcces[]>([]);
  let rechercheParTypologie = $state<Typologie[]>([]);
  let rechercheParSource = $state<Source[]>([]);

  // ─── Navigation par sections ───────────────────────────────────────────────────

  type Section = 'guides' | 'ressourcesEtServices';
  let indexActif = $state(0);
  let sectionActive = $derived<Section>(indexActif === 0 ? 'guides' : 'ressourcesEtServices');

  // ─── Mapping collection ↔ id URL ──────────────────────────────────────────────

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
  const depuisIdsCollection = (ids: string[]): CollectionGuide[] =>
    ids.map((i) => nomsCollectionsGuide[i]).filter(Boolean);

  // ─── Fragment de navigation (hash URL) ────────────────────────────────────────

  // Initialisé à undefined côté SSR (window n'existe pas), puis créé côté client.
  let fragmentDeNavigation: FragmentDeNavigation | undefined = $state(undefined);

  const appliqueLesFiltres = (fragment: FragmentDeNavigation) => {
    rechercheParBesoin = fragment.extraisValeur<BesoinCyber>('besoin', null);
    rechercheParLangue = fragment.extraisTableau<Langue>('langues');
    rechercheParCollection = depuisIdsCollection(fragment.extraisTableau<CollectionGuide>('collections'));
    rechercheTextuelle = fragment.extraisValeur('q', '');
    rechercheParDroitAcces = fragment.extraisTableau<DroitAcces>('accessibilite');
    rechercheParTypologie = fragment.extraisTableau<Typologie>('types');
    rechercheParSource = fragment.extraisTableau<Source>('sources');
  };

  // Synchronise le hash à chaque changement de filtre (côté client uniquement)
  $effect(() => {
    if (!fragmentDeNavigation) return;
    fragmentDeNavigation.change('besoin', rechercheParBesoin);
    fragmentDeNavigation.change('langues', rechercheParLangue);
    fragmentDeNavigation.change('collections', versIdsCollection(rechercheParCollection));
    fragmentDeNavigation.change('q', rechercheTextuelle);
    fragmentDeNavigation.change('accessibilite', rechercheParDroitAcces);
    fragmentDeNavigation.change('types', rechercheParTypologie);
    fragmentDeNavigation.change('sources', rechercheParSource);
    if (window) window.location.hash = fragmentDeNavigation.serialise();
  });

  onMount(() => {
    // Lecture du hash initial une seule fois après le montage
    fragmentDeNavigation = creeLeFragmentDeNavigation(window.location.hash);
    appliqueLesFiltres(fragmentDeNavigation);
  });

  // ─── Réinitialisation ─────────────────────────────────────────────────────────

  const reinitialiseFiltres = () => {
    rechercheTextuelle = '';
    rechercheParBesoin = null;
    rechercheParLangue = [];
    rechercheParCollection = [];
    rechercheParDroitAcces = [];
    rechercheParTypologie = [];
    rechercheParSource = [];
  };

  // ─── Filtrage côté client ─────────────────────────────────────────────────────

  // const normalise = (s: string) =>
  //   s
  //     .toLowerCase()
  //     .normalize('NFD')
  //     .replace(/\p{Diacritic}/gu, '');

  // const guidesFiltres = $derived(() => {
  //   let resultats = guides;

  //   if (rechercheParBesoin) {
  //     resultats = resultats.filter((g) => g.besoin === rechercheParBesoin);
  //   }
  //   if (rechercheParLangue.length) {
  //     resultats = resultats.filter((g) => rechercheParLangue.includes(g.langue));
  //   }
  //   if (rechercheParCollection.length) {
  //     resultats = resultats.filter((g) => rechercheParCollection.includes(g.collection));
  //   }
  //   if (rechercheTextuelle.trim()) {
  //     const q = normalise(rechercheTextuelle.trim());
  //     resultats = resultats.filter((g) => normalise(g.nom).includes(q) || normalise(g.description ?? '').includes(q));
  //   }
  //   return resultats;
  // });

  // const ressourcesFiltrees = $derived(() => {
  //   let resultats = toutesLesRessources;

  //   if (rechercheParBesoin) {
  //     resultats = resultats.filter((r) => r.besoin === rechercheParBesoin);
  //   }
  //   if (rechercheParDroitAcces.length) {
  //     resultats = resultats.filter((r) => rechercheParDroitAcces.includes(r.droitAcces));
  //   }
  //   if (rechercheParTypologie.length) {
  //     resultats = resultats.filter((r) => rechercheParTypologie.includes(r.typologie));
  //   }
  //   if (rechercheParSource.length) {
  //     resultats = resultats.filter((r) => rechercheParSource.includes(r.source));
  //   }
  //   if (rechercheTextuelle.trim()) {
  //     const q = normalise(rechercheTextuelle.trim());
  //     resultats = resultats.filter((r) => normalise(r.titre).includes(q) || normalise(r.description ?? '').includes(q));
  //   }
  //   return resultats;
  // });

  // ─── Indicateur de présence de filtres actifs ──────────────────────────────────

  const filtreActif = $derived(
    rechercheParBesoin !== null ||
      rechercheParLangue.length > 0 ||
      rechercheParCollection.length > 0 ||
      rechercheParDroitAcces.length > 0 ||
      rechercheParTypologie.length > 0 ||
      rechercheParSource.length > 0 ||
      rechercheTextuelle.trim().length > 0
  );
</script>

<!-- ── Barre filtre besoin (toujours visible) ─────────────────────────────── -->
<div class="barre-filtre-besoin">
  <div class="contenu-section">
    <!--
      FiltreBesoin utilise rechercheParBesoin via un bind ou un callback.
      Adaptez selon l'API réelle du composant.
    -->
    <!-- <FiltreBesoin bind:valeur={rechercheParBesoin} /> -->
  </div>
</div>

<!-- ── Filtres mobile ─────────────────────────────────────────────────────── -->
<FiltresMobile {filtreActif}>
  <!-- <FiltreBesoin bind:valeur={rechercheParBesoin} /> -->
  {#if sectionActive === 'guides'}
    <!-- <FiltreLangue bind:valeurs={rechercheParLangue} />
    <FiltreCollection bind:valeurs={rechercheParCollection} /> -->
  {:else}
    <!-- <FiltreAccessibilite bind:valeurs={rechercheParDroitAcces} />
    <FiltreTypologie bind:valeurs={rechercheParTypologie} />
    <FiltreSource bind:valeurs={rechercheParSource} /> -->
  {/if}
  <input type="button" class="bouton primaire" value="Réinitialiser les filtres" onclick={reinitialiseFiltres} />
</FiltresMobile>

<!-- ── Recherche textuelle mobile ─────────────────────────────────────────── -->
<dsfr-container class="barre-recherche-mobile">
  <ChampRecherche bind:recherche={rechercheTextuelle} />
</dsfr-container>

<!-- ── Onglets guides / ressources ───────────────────────────────────────── -->
<ControleSegmente
  elements={[
    { id: 'guides', titre: "Guides de l'ANSSI", icone: 'book-2-line', ancre: 'guides' },
    { id: 'ressources-et-services', titre: 'Services et outils', icone: 'list-check', ancre: 'ressourcesEtServices' },
  ]}
  bind:indexActif
  {fragmentDeNavigation}
  lorsDuChangement={appliqueLesFiltres}
/>

<!-- ── Contenu principal ──────────────────────────────────────────────────── -->
<dsfr-container class="contenu-catalogue">
  <!-- {#if !$profilStore && sectionActive === 'guides'}
    <div class="entete">
      <InciteASAbonner />
    </div>
  {/if} -->

  <div class="grille">
    <!-- Filtres bureau (colonne latérale) -->
    <FiltresBureau {filtreActif}>
      <ChampRecherche slot="avant-entete" bind:recherche={rechercheTextuelle} />
      {#if sectionActive === 'guides'}
        <!-- <FiltreLangue bind:valeurs={rechercheParLangue} />
        <FiltreCollection bind:valeurs={rechercheParCollection} /> -->
      {:else}
        <!-- <FiltreAccessibilite bind:valeurs={rechercheParDroitAcces} />
        <FiltreTypologie bind:valeurs={rechercheParTypologie} />
        <FiltreSource bind:valeurs={rechercheParSource} /> -->
      {/if}
      <input type="button" class="bouton primaire" value="Réinitialiser les filtres" onclick={reinitialiseFiltres} />
    </FiltresBureau>

    <!-- Grille de résultats -->
    {#if sectionActive === 'guides'}
      {#each guides as guide (guide.id)}
        <CarteItem item={guide} avecBoutonFavori />
      {:else}
        <div class="aucun-resultat">
          <img src="/assets/images/homme-cherchant-avec-loupe.svg" alt="" aria-hidden="true" />
          <p class="fr-h3">Désolé, aucun résultat trouvé</p>
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            onclick={reinitialiseFiltres}
          />
        </div>
      {/each}
    {:else}
      <!-- {#each ressourcesFiltrees() as itemCyber (itemCyber.id)}
        <CarteItem item={itemCyber} avecBoutonFavori />
      {:else}
        <div class="aucun-resultat">
          <img src="/assets/images/homme-cherchant-avec-loupe.svg" alt="" aria-hidden="true" />
          <p class="fr-h3">Désolé, aucun résultat trouvé</p>
          <input
            type="button"
            class="bouton primaire"
            value="Réinitialiser les filtres"
            onclick={reinitialiseFiltres}
          />
        </div>
      {/each} -->
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
