<script lang="ts">
  import * as api from './simulateurNi2.api';
  import { questionnaireStore } from './stores/questionnaire.store';
  import { clic } from '../directives/actions.svelte';
</script>

<dsfr-container>
  {#if ($questionnaireStore.etapeCourante === "prealable")}
    <h1 use:clic={() => {
      questionnaireStore.repond({type: "VALIDE_ETAPE_PREALABLE"});
    }}>Étape préalable</h1>
  {:else if ($questionnaireStore.etapeCourante === "designationOperateurServicesEssentiels")}
    <h1>Désignation</h1>
  {/if}

  <h1>SIMULATEUR NIS 2</h1>

  <dsfr-button
    label="ENVOYER"
    size="sm"
    use:clic={async () => await api.envoyerReponses({ question1: true })}
  ></dsfr-button>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 20px;
  }
</style>
