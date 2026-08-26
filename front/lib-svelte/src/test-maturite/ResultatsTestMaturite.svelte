<script lang="ts">
  import { onMount } from 'svelte';
  import { extraisSegmentsDuFragment } from '../navigation/fragmentDeNavigation.svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane, type PropriétésFilAriane } from '../ui/filAriane';
  import Heros from '../ui/Heros.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  const clesOnglet = ['#votre-organisation', '#comparaison', '#historique'] as const;
  type CleOnglet = (typeof clesOnglet)[number];

  interface Props {
    animeTuiles?: boolean;
    dateRealisation?: Date;
    defilementAutomatique?: boolean;
    idNiveau: IdNiveau;
  }

  let { animeTuiles = true, dateRealisation, defilementAutomatique = true, idNiveau }: Props = $props();

  let lienActif: CleOnglet | undefined = $state();
  let idRésultatTest: string | undefined = $state();

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
    return () => window.removeEventListener('hashchange', changeOngletActif);
  });

  const liens = [
    { label: 'Maturité cyber de votre organisation', fragment: '#votre-organisation' },
    { label: 'Historique', fragment: '#historique' },
    { label: 'Comparaison avec d’autres entités', fragment: '#comparaison' },
  ];
  const propriétésFilAriane: PropriétésFilAriane = {
    feuille: 'Test de maturité cyber',
  };
</script>

<Heros
  description="Votre résultat vous permet de situer votre niveau de maturité cyber actuel et de suivre son évolution au fil de vos actions."
  format="banniere"
  segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane)}
  theme="clair"
  titre="Maturité cyber de votre organisation"
></Heros>

<PropositionRefaireTest />

{#if $profilStore && lienActif}
  <dsfr-container>
    <NavigationTertiaire {liens} bind:lienActif />
  </dsfr-container>
{/if}

{#if lienActif === '#votre-organisation'}
  <ResultatsMonOrganisation {animeTuiles} {dateRealisation} {defilementAutomatique} {idNiveau} />
{:else if lienActif === '#historique' && $profilStore}
  <HistoriqueTests {idRésultatTest} />
{:else if $profilStore}
  <ComparaisonTest />
{/if}
