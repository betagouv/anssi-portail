<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
  import { scénarios, type IdScénario } from '../scenarios';
  import { rôles, type IdRôle } from '../roles';
  import ChoixRole from './ChoixRole.svelte';
  import ChoixScenario from './ChoixScenario.svelte';
  import MiseEnSituation from './MiseEnSituation.svelte';
  import Simulation from './simulation/Simulation.svelte';

  type Étape = 'scénario' | 'rôle' | 'mise-en-situation' | 'simulation';
  let étape: Étape = $state('scénario');
  let idScénarioSélectionné: IdScénario | undefined = $state();
  let idRôleSélectionné: IdRôle | undefined = $state();

  const scénarioSélectionné = $derived(scénarios.find(({ id }) => id === idScénarioSélectionné));
  const rôleSélectionné = $derived(rôles.find(({ id }) => id === idRôleSélectionné));

  const choisitScénario = (id: IdScénario) => {
    idScénarioSélectionné = id;
    étape = 'rôle';
  };

  const reviensAuChoixDeScénario = () => {
    étape = 'scénario';
  };

  const reviensAuChoixDeRôle = () => {
    étape = 'rôle';
  };

  const choisitRôle = (id: IdRôle) => {
    idRôleSélectionné = id;
  };

  const confirmeRôle = () => {
    étape = 'mise-en-situation';
  };

  const lanceSimulation = () => {
    étape = 'simulation';
  };
</script>

<div class="parcours-reflexe-cyber" class:simulation={étape === 'simulation'}>
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
      surÉtapePrécédente={reviensAuChoixDeScénario}
      surÉtapeSuivante={confirmeRôle}
    />
  {:else if étape === 'mise-en-situation'}
    <MiseEnSituation
      scénario={scénarioSélectionné!}
      rôle={rôleSélectionné!}
      surModificationScénario={reviensAuChoixDeScénario}
      surModificationRôle={reviensAuChoixDeRôle}
      surLancement={lanceSimulation}
    />
  {:else if étape === 'simulation'}
    <Simulation scénario={scénarioSélectionné!} rôle={rôleSélectionné!} />
  {/if}
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);

    &.simulation {
      background-color: var(--background-default-grey);
    }
  }
</style>
