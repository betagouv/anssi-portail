<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { DernierResultatTest } from './ResultatsTest.type';
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import { questionnaireStore } from './stores/questionnaire.store';

  let dateRealisationDernierTest: Date | undefined;

  questionnaireStore.initialise();

  onMount(async () => {
    try {
      const reponseHttp = await axios.get<DernierResultatTest>(
        '/api/resultats-test/dernier'
      );
      const reponses = reponseHttp.data.reponses;
      dateRealisationDernierTest = new Date(reponseHttp.data.dateRealisation);
      questionnaireStore.chargeReponses(reponses);
    } catch (e) {
      if (e?.status === 404) {
        window.location.href = '/test-maturite';
      } else {
        throw e;
      }
    }
  });
</script>

<ResultatsTestMaturite
  affichePubMsc={false}
  afficheRappelReponses={true}
  animeTuiles={false}
  {dateRealisationDernierTest}
  defilementAutomatique={false}
/>
