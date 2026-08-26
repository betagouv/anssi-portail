<script lang="ts">
  import axios, { AxiosError } from 'axios';
  import { onMount } from 'svelte';
  import type { DernierResultatTest } from './ResultatsTest.type';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';

  let dernierRésultatTest: DernierResultatTest | undefined = $state();

  onMount(async () => {
    try {
      const reponseHttp = await axios.get<DernierResultatTest>('/api/resultats-test/dernier');
      dernierRésultatTest = reponseHttp.data;
    } catch (e) {
      if (e instanceof AxiosError && e.status === 404) {
        window.location.href = '/test-maturite';
      } else {
        throw e;
      }
    }
  });
</script>

{#if dernierRésultatTest}
  <ResultatsTestMaturite
    animeTuiles={false}
    dateRealisation={new Date(dernierRésultatTest.dateRealisation)}
    idNiveau={dernierRésultatTest.idNiveau}
    defilementAutomatique={false}
  />
{/if}
