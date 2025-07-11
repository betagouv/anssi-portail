<script lang="ts">
  import CarteTestMaturite, {
    type ResultatTest,
  } from './CarteTestMaturite.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { questionnaireStore } from './stores/questionnaire.store';
  import ResultatsMonOrganisation from './ResultatsMonOrganisation.svelte';

  export let idResultatTest: string | undefined;

  let resultatsTest: ResultatTest[] = [];
  let resultatsTestParAnnee: ResultatsParAnnee = {};

  type ResultatsParAnnee = Record<number, ResultatTest[]>;

  onMount(async () => {
    const reponse = await axios.get<ResultatTest[]>('/api/resultats-test');
    resultatsTest = reponse.data;
    resultatsTestParAnnee = resultatsTest
      .sort(
        (a, b) =>
          new Date(b.dateRealisation).getTime() -
          new Date(a.dateRealisation).getTime()
      )
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
    if (resultatTestSelectionne)
      questionnaireStore.chargeReponses(resultatTestSelectionne.reponses);
  }
</script>

{#if resultatTestSelectionne}
  <section class="section-retour-historique">
    <div class="contenu-section">
      <lab-anssi-lien
        href="/ma-maturite#historique"
        titre="Retour"
        icone="arrow-go-back-line"
        positionIcone="gauche"
      ></lab-anssi-lien>
    </div>
  </section>
  <ResultatsMonOrganisation
    animeTuiles={false}
    affichePubMsc={false}
    afficheRappelReponses
    dateRealisation={new Date(resultatTestSelectionne.dateRealisation)}
  />
{:else}
  <section>
    <div class="contenu-section">
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
    </div>
  </section>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding-top: 32px;
    padding-bottom: 72px;
  }

  .section-retour-historique {
    padding: 32px var(--gouttiere) 8px;
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
