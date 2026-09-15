<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
  import { scénarios, type IdScénario } from '../scenarios';
  import ChoixScenario from './ChoixScenario.svelte';

  type Étape = 'scénario';
  let étape: Étape = $state('scénario');
  let _idScénarioSélectionné: IdScénario | undefined = $state();

  const choisitScénario = (id: IdScénario) => {
    _idScénarioSélectionné = id;
  };
</script>

<div class="parcours-reflexe-cyber">
  <dsfr-container>
    <FilAriane
      feuille="Réflexe cyber&nbsp;: comment réagirez-vous en cas de cyberattaque&nbsp;?"
      branche={{ nom: 'Faire le test !', lien: '/faire-le-test' }}
    />
  </dsfr-container>

  {#if étape === 'scénario'}
    <ChoixScenario {scénarios} surChoix={choisitScénario} />
  {/if}
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);
  }
</style>
