<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import OngletsTest, {
    type CleOnglet,
    clesOnglet,
  } from './OngletsTest.svelte';
  import { profilStore } from '../stores/profil.store';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import { onMount } from 'svelte';

  export let affichePubMsc = true;
  export let afficheRappelReponses = false;
  export let animeTuiles = true;
  export let dateRealisationDernierTest : Date | undefined = undefined;

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
</script>

<Hero
  titre="Résultat de maturité cyber"
  description="Ce résultat nous permet de vous guider et de vous fournir les informations et les outils essentiels pour agir sur votre maturité cyber."
  ariane={$profilStore ? 'Maturité cyber' : 'Tester votre maturité cyber'}
/>

<PropositionRefaireTest />

<OngletsTest bind:ongletActif />

{#if ongletActif === 'votre-organisation'}
  <ResultatsMonOrganisation
    {animeTuiles}
    {affichePubMsc}
    {afficheRappelReponses}
    dateRealisation={dateRealisationDernierTest}
  />
{:else if ongletActif === 'historique'}
  <HistoriqueTests {idResultatTest} />
{:else}
  <ComparaisonTest testRealise={true} />
{/if}
