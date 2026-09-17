<script lang="ts">
  import FilAriane from '../../../ui/FilAriane.svelte';
  import ChoixRole from './ChoixRole.svelte';
  import ChoixScenario from './ChoixScenario.svelte';
  import MiseEnSituation from './MiseEnSituation.svelte';
  import { type IdRôle, rôles } from './roles';
  import { type IdScénario, scénarios } from './scenarios';
  import ScoreFinalReflexeCyber from './ScoreFinalReflexeCyber.svelte';
  import Simulation from './simulation/Simulation.svelte';

  type Étape = 'scénario' | 'rôle' | 'mise-en-situation' | 'simulation' | 'score-final';
  let étape: Étape = $state('scénario');
  let idScénarioSélectionné: IdScénario | undefined = $state();
  let idRôleSélectionné: IdRôle | undefined = $state();

  const scénarioSélectionné = $derived(scénarios.find(({ id }) => id === idScénarioSélectionné));
  const rôleSélectionné = $derived(rôles.find(({ id }) => id === idRôleSélectionné));

  const score = $state<boolean[]>([]);

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

  const termineSimulation = () => {
    étape = 'score-final';
  };
</script>

<div
  class="parcours-reflexe-cyber"
  class:simulation={étape === 'simulation'}
  class:score-final={étape === 'score-final'}
>
  <dsfr-container>
    <FilAriane
      feuille="Réflexe cyber&nbsp;: comment réagirez-vous en cas de cyber&shy;attaque&nbsp;?"
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
    <Simulation
      scénario={scénarioSélectionné!}
      rôle={rôleSélectionné!}
      {score}
      surSimulationTerminée={termineSimulation}
    />
  {:else if étape === 'score-final'}
    <ScoreFinalReflexeCyber réponses={score} />
  {/if}
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);

    &.simulation,
    &.score-final {
      background-color: var(--background-default-grey);
    }
  }
</style>
