<script lang="ts">
  import { onMount } from 'svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';
  import { profilStore } from '../stores/profil.store';
  import { fabriqueFilAriane } from '../ui/filAriane';
  import FilAriane, { type Props as PropriétésFilAriane } from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import ComparaisonTest from './ComparaisonTest.svelte';
  import HistoriqueTests from './HistoriqueTests.svelte';
  import PropositionRefaireTest from './PropositionRefaireTest.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';
  import { afficheNouvelleDA } from '$plateforme/environnement';
  import Lien from '../ui/Lien.svelte';
  import Alternatives from '../ui/Alternatives.svelte';

  const clesOnglet = ['votre-organisation', 'comparaison', 'historique'];
  type CleOnglet = (typeof clesOnglet)[number];

  export let animeTuiles = true;
  export let dateRealisationDernierTest: Date | undefined = undefined;
  export let defilementAutomatique = true;

  let lienActif: CleOnglet | undefined;
  let idResultatTest: string | undefined;
  let propriétésFilAriane: PropriétésFilAriane;

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
  $: propriétésFilAriane = {
    feuille: $profilStore ? 'Maturité cyber' : 'Test de maturité cyber',
    fondSombre: true,
  };
</script>

<Alternatives affichageAlternatif={afficheNouvelleDA}>
  {#snippet alternatif()}
    <dsfr-container class="lien-retour">
      <Lien href="/" libelle="Retour à l'accueil" icone="arrow-go-back-line"></Lien>
    </dsfr-container>
  {/snippet}
  {#snippet défaut()}
    <Heros
      description="Testez la maturité cyber de votre organisation, suivez vos progrès et comparez-vous aux autres organisations."
      format="banniere"
      segmentsFilAriane={fabriqueFilAriane(propriétésFilAriane, !!$profilStore)}
      theme="sombre"
      titre="Maturité cyber"
    >
      {#snippet filAriane()}
        <FilAriane {...propriétésFilAriane} />
      {/snippet}
    </Heros>
  {/snippet}
</Alternatives>

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

<style>
  .lien-retour {
    margin: 24px 0;
  }
</style>
