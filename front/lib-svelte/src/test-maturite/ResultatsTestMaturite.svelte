<script lang="ts">
  import { onMount } from 'svelte';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import OngletsTest, {
    type CleOnglet,
    clesOnglet,
  } from './OngletsTest.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  export let affichePubMsc = true;
  export let afficheRappelReponses = false;
  export let animeTuiles = true;
  export let dateRealisationDernierTest: Date | undefined = undefined;
  export let defilementAutomatique = true;
  export let featureFlagFiltresComparaison: boolean = false;

  let ongletActif: CleOnglet | undefined;
  let idResultatTest: string | undefined;

  const changeOngletActif = () => {
    const ongletRiche = window.location.hash.slice(1).split('/');
    const onglet = ongletRiche[0];
    idResultatTest = ongletRiche?.[1];
    ongletActif = clesOnglet.includes(onglet) ? onglet : 'votre-organisation';
  };

  onMount(() => {
    window.addEventListener('hashchange', changeOngletActif);
    changeOngletActif();
  });

  $: {
    if (ongletActif) {
      if (ongletActif !== 'historique') idResultatTest = undefined;
      history.pushState(
        null,
        '',
        `${window.location.pathname}#${ongletActif}${idResultatTest ? '/' + idResultatTest : ''}`
      );
    }
  }

  const afficheHistorique = () => {
    idResultatTest = undefined;
    history.pushState(null, '', `${window.location.pathname}#historique`);
  };
</script>

<Hero
  titre="Maturité cyber"
  description="Testez la maturité cyber de votre organisation, suivez vos progrès et comparez-vous aux autres organisations."
  ariane={$profilStore ? 'Maturité cyber' : 'Test de maturité cyber'}
/>

<PropositionRefaireTest />

<OngletsTest bind:ongletActif on:reclicHistorique={afficheHistorique} />

{#if ongletActif === 'votre-organisation'}
  <ResultatsMonOrganisation
    {animeTuiles}
    {affichePubMsc}
    {afficheRappelReponses}
    dateRealisation={dateRealisationDernierTest}
    {defilementAutomatique}
  />
{:else if ongletActif === 'historique'}
  <HistoriqueTests {idResultatTest} />
{:else}
  <ComparaisonTest testRealise={true} {featureFlagFiltresComparaison} />
{/if}
