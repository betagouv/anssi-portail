<script lang="ts">
  import { onMount } from 'svelte';
  import { extraisSegmentsDuFragment } from '../navigation/fragmentDeNavigation.svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import Lien from '../ui/Lien.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  const clesOnglet = ['#votre-organisation', '#comparaison', '#historique'] as const;
  type CleOnglet = (typeof clesOnglet)[number];

  export let animeTuiles = true;
  export let dateRealisation: Date | undefined = undefined;
  export let defilementAutomatique = true;
  export let idNiveau: IdNiveau;

  let lienActif: CleOnglet | undefined;
  let idRésultatTest: string | undefined;

  const changeOngletActif = () => {
    const [onglet, id] = extraisSegmentsDuFragment(window.location.hash);
    const fragmentOnglet = `#${onglet}`;
    idRésultatTest = id;
    lienActif = clesOnglet.includes(fragmentOnglet as CleOnglet)
      ? (fragmentOnglet as CleOnglet)
      : '#votre-organisation';
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

<dsfr-container class="lien-retour">
  <Lien href="/" libelle="Retour à l'accueil" icone="arrow-go-back-line"></Lien>
</dsfr-container>

{#if $profilStore && lienActif}
  <NavigationTertiaire {liens} bind:lienActif />
{/if}

<PropositionRefaireTest />

{#if lienActif === '#votre-organisation'}
  <ResultatsMonOrganisation {animeTuiles} {dateRealisation} {defilementAutomatique} {idNiveau} />
{:else if lienActif === '#historique' && $profilStore}
  <HistoriqueTests {idRésultatTest} />
{:else if $profilStore}
  <ComparaisonTest />
{/if}

<style>
  .lien-retour {
    margin: 24px 0;
  }
</style>
