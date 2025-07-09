<script lang="ts">
  import Hero from '../ui/Hero.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import OngletsTest, { type CleOnglet } from './OngletsTest.svelte';
  import { profilStore } from '../stores/profil.store';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';

  export let affichePubMsc = true;
  export let afficheRappelReponses = false;
  export let animeTuiles = true;

  let ongletActif: CleOnglet = 'historique';
</script>

<Hero
  titre="Résultat de maturité cyber"
  description="Ce résultat nous permet de vous guider et de vous fournir les informations et les outils essentiels pour agir sur votre maturité cyber."
  ariane={$profilStore ? 'Maturité cyber' : 'Tester votre maturité cyber'}
/>

<PropositionRefaireTest />

<OngletsTest bind:ongletActif />

{#if ongletActif === 'votre-organisation'}
  <ResultatsMonOrganisation {animeTuiles} {affichePubMsc} {afficheRappelReponses} />
{:else if ongletActif === 'historique' }
  <HistoriqueTests />
{:else}
  <ComparaisonTest testRealise={true} />
{/if}
