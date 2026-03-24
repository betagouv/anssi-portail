<script lang="ts">
  import * as api from './simulateurNi2.api';
</script>

<dsfr-container>
  <h1>SIMULATEUR NIS 2</h1>

  <dsfr-button
    label="ENVOYER"
    size="sm"
    onclick={async () => await api.envoyerReponses({ question1: true })}
  ></dsfr-button>
</dsfr-container>

<style lang="scss">
  dsfr-container {
    padding-bottom: 20px;
  }
</style>
