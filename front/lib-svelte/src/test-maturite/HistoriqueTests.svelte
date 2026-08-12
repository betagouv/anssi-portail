<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Lien from '../ui/Lien.svelte';
  import CarteTestMaturite, { type RésultatTest } from './CarteTestMaturite.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  export let idRésultatTest: string | undefined;

  let résultatsTest: RésultatTest[] = [];
  let résultatsTestParAnnée: RésultatsParAnnée = {};

  type RésultatsParAnnée = Record<number, RésultatTest[]>;

  onMount(async () => {
    const réponse = await axios.get<RésultatTest[]>('/api/resultats-test');
    résultatsTest = réponse.data;
    résultatsTestParAnnée = résultatsTest
      .sort((a, b) => new Date(b.dateRealisation).getTime() - new Date(a.dateRealisation).getTime())
      .reduce((accumulateur: RésultatsParAnnée, élément: RésultatTest) => {
        const année = new Date(élément.dateRealisation).getFullYear();
        if (!(année in accumulateur)) accumulateur[année] = [];
        accumulateur[année].push(élément);
        return accumulateur;
      }, {} as RésultatsParAnnée);
  });

  $: années = Object.keys(résultatsTestParAnnée)
    .map((a) => Number(a))
    .sort((a, b) => b - a);
  $: résultatTestSelectionné = idRésultatTest
    ? résultatsTest.find((résultat) => résultat.id === idRésultatTest)
    : undefined;
</script>

{#if résultatTestSelectionné}
  <dsfr-container class="section-retour-historique">
    <Lien href="/ma-maturite#historique" libelle="Retour" icone="arrow-go-back-line" />
  </dsfr-container>
  <ResultatsMonOrganisation
    animeTuiles={false}
    dateRealisation={new Date(résultatTestSelectionné.dateRealisation)}
    defilementAutomatique={false}
    idNiveau={résultatTestSelectionné.niveau}
  />
{:else}
  <dsfr-container>
    <h2>Historique de votre maturité cyber</h2>

    {#each années as année (année)}
      <div>
        <h3>{année}</h3>
        <div class="cartes">
          {#each résultatsTestParAnnée[Number(année)] as résultatTest (résultatTest.id)}
            <CarteTestMaturite {résultatTest} />
          {/each}
        </div>
      </div>
    {/each}
  </dsfr-container>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  dsfr-container {
    padding-top: 32px;
    padding-bottom: 72px;
  }

  .section-retour-historique {
    padding: 32px 0 8px;
  }

  h2 {
    margin: 0 0 32px;
    font-size: 1.75rem;
    line-height: 2.25rem;
  }

  h3 {
    font-size: 1.25rem;
    line-height: 2rem;
    margin: 24px 0 12px;

    @include a-partir-de(md) {
      font-size: 1.375rem;
      line-height: 1.75rem;
    }
  }

  .cartes {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
