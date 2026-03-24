<script lang="ts">
  import * as api from './simulateurNi2.api';
  import { clic } from '../directives/actions.svelte';
</script>

<dsfr-container>
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
