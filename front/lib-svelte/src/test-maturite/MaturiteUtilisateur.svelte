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
    const reponseHttp = await axios.get<DernierResultatTest>(
      '/api/resultats-test/dernier'
    );
    const reponses = reponseHttp.data.reponses;
    questionnaireStore.chargeReponses(reponses);
  });
</script>

<ResultatsTestMaturite affichePubMsc={false} />
