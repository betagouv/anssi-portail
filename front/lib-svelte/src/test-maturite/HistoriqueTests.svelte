<script lang="ts">
  import CarteTestMaturite, {
    type ResultatTest,
  } from './CarteTestMaturite.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let resultatsTest: ResultatsParAnnee = {};

  type ResultatsParAnnee = Record<number, ResultatTest[]>;

  onMount(async () => {
    const reponse = await axios.get<ResultatTest[]>('/api/resultats-test');
    resultatsTest = reponse.data
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

  $: annees = Object.keys(resultatsTest)
    .map((a) => Number(a))
    .sort((a, b) => b - a);
</script>

<section>
  <div class="contenu-section">
    <h2>Historique de votre maturité cyber</h2>
    {#each annees as annee (annee)}
      <div class="annee">
        <h3>{annee}</h3>
        <div class="cartes">
          {#each resultatsTest[Number(annee)] as resultatTest (resultatTest.id)}
            <CarteTestMaturite {resultatTest} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding-top: 32px;
    padding-bottom: 72px;
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
