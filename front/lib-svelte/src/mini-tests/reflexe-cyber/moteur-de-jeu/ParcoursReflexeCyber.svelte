<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
  import { scénarios, type IdScénario } from '../scenarios';
  import { rôles, type IdRôle } from '../roles';
  import ChoixRole from './ChoixRole.svelte';
  import ChoixScenario from './ChoixScenario.svelte';

  type Étape = 'scénario' | 'rôle';
  let étape: Étape = $state('scénario');
  let _idScénarioSélectionné: IdScénario | undefined = $state();
  let idRôleSélectionné: IdRôle | undefined = $state();

  const choisitScénario = (id: IdScénario) => {
    _idScénarioSélectionné = id;
    étape = 'rôle';
  };

  const reviensAuScénario = () => {
    étape = 'scénario';
  };

  const choisitRôle = (id: IdRôle) => {
    idRôleSélectionné = id;
  };

  const confirmeRôle = () => {
    // TODO : À implémenter
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
  {:else if étape === 'rôle'}
    <ChoixRole
      {rôles}
      rôleSélectionné={idRôleSélectionné}
      surChoix={choisitRôle}
      surÉtapePrécédente={reviensAuScénario}
      surÉtapeSuivante={confirmeRôle}
    />
  {/if}
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);
  }
</style>
