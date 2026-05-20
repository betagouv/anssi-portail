<script lang="ts">
  import { onMount } from 'svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import { profilStore } from '../stores/profil.store';
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  const clesOnglet = ['votre-organisation', 'comparaison', 'historique'];
  type CleOnglet = (typeof clesOnglet)[number];

  export let animeTuiles = true;
  export let dateRealisationDernierTest: Date | undefined = undefined;
  export let defilementAutomatique = true;

  let lienActif: CleOnglet | undefined;
  let idResultatTest: string | undefined;

  const changeOngletActif = () => {
    const ongletRiche = window.location.hash.slice(1).split('/');
    const onglet = ongletRiche[0];
    idResultatTest = ongletRiche?.[1];
    lienActif = clesOnglet.includes(onglet) ? onglet : '#votre-organisation';
  };

  onMount(() => {
    window.addEventListener('hashchange', changeOngletActif);
    changeOngletActif();
  });

  const liens = [
    { label: 'Maturité cyber de votre organisation', fragment: '#votre-organisation' },
    { label: 'Historique', fragment: '#historique' },
    { label: 'Comparaison avec d’autres entités', fragment: '#comparaison' },
  ];
</script>

<Hero
  titre="Maturité cyber"
  description="Testez la maturité cyber de votre organisation, suivez vos progrès et comparez-vous aux autres organisations."
  ariane={$profilStore ? 'Maturité cyber' : 'Test de maturité cyber'}
/>

<PropositionRefaireTest />

{#if $profilStore && lienActif}
  <NavigationTertiaire {liens} bind:lienActif />
{/if}

{#if lienActif === '#votre-organisation'}
  <ResultatsMonOrganisation {animeTuiles} dateRealisation={dateRealisationDernierTest} {defilementAutomatique} />
{:else if lienActif === '#historique' && $profilStore}
  <HistoriqueTests {idResultatTest} />
{:else if $profilStore}
  <ComparaisonTest />
{/if}
