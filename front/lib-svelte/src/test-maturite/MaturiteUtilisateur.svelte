<script lang="ts">
  import ResultatsTestMaturite from './ResultatsTestMaturite.svelte';
  import { questionnaireStore } from './stores/questionnaire.store';
  import { onMount } from 'svelte';
  import type { IdRubrique } from './TestMaturite.donnees';
  import axios from 'axios';

  questionnaireStore.initialise();

  type DernierResultatTest = {
    reponses: Record<IdRubrique, number>;
  };

  onMount(async () => {
    try {
      const reponseHttp = await axios.get<DernierResultatTest>(
        '/api/resultats-test/dernier'
      );
      const reponses = reponseHttp.data.reponses;
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
/>
