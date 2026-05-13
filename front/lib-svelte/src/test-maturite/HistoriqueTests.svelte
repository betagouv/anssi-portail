<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import Lien from '../ui/Lien.svelte';
  import CarteTestMaturite, { type ResultatTest } from './CarteTestMaturite.svelte';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';
  import { questionnaireStore } from './stores/questionnaire.store';

  export let idResultatTest: string | undefined;

  let resultatsTest: ResultatTest[] = [];
  let resultatsTestParAnnee: ResultatsParAnnee = {};

  type ResultatsParAnnee = Record<number, ResultatTest[]>;

  onMount(async () => {
    const reponse = await axios.get<ResultatTest[]>('/api/resultats-test');
    resultatsTest = reponse.data;
    resultatsTestParAnnee = resultatsTest
      .sort((a, b) => new Date(b.dateRealisation).getTime() - new Date(a.dateRealisation).getTime())
      .reduce((accumulateur: ResultatsParAnnee, element: ResultatTest) => {
        const annee = new Date(element.dateRealisation).getFullYear();
        if (!(annee in accumulateur)) accumulateur[annee] = [];
        accumulateur[annee].push(element);
        return accumulateur;
      }, {} as ResultatsParAnnee);
  });

  $: annees = Object.keys(resultatsTestParAnnee)
    .map((a) => Number(a))
    .sort((a, b) => b - a);

  $: resultatTestSelectionne = idResultatTest
    ? resultatsTest.find((resultat) => resultat.id === idResultatTest)
    : undefined;

  $: {
    if (resultatTestSelectionne) questionnaireStore.chargeReponses(resultatTestSelectionne.reponses);
  }
</script>

{#if resultatTestSelectionne}
  <dsfr-container class="section-retour-historique">
    <Lien href="/ma-maturite#historique" libelle="Retour" icone="arrow-go-back-line" />
  </dsfr-container>
  <ResultatsMonOrganisation
    animeTuiles={false}
    dateRealisation={new Date(resultatTestSelectionne.dateRealisation)}
    defilementAutomatique={false}
  />
{:else}
  <dsfr-container>
    <h2>Historique de votre maturité cyber</h2>
    {#each annees as annee (annee)}
      <div class="annee">
        <h3>{annee}</h3>
        <div class="cartes">
          {#each resultatsTestParAnnee[Number(annee)] as resultatTest (resultatTest.id)}
            <CarteTestMaturite {resultatTest} />
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
