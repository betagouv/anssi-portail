<script lang="ts">
  import CarteTestMaturite, { type ResultatTest } from './CarteTestMaturite.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let resultatsTest: ResultatTest[] = [];

  onMount(async () => {
    const reponse = await axios.get<ResultatTest[]>('/api/resultats-test');
    resultatsTest = reponse.data;
  });
</script>

<section>
  <div class="contenu-section">
    <h2>Historique de votre maturité cyber</h2>
    <div class="cartes">
      {#each resultatsTest as resultatTest (resultatTest.id)}
        <CarteTestMaturite {resultatTest} />
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  section {
    padding-top: 32px;
  }

  h2 {
    margin: 0 0 32px;
    font-size: 1.75rem;
    line-height: 2.25rem;
  }

  .cartes {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
