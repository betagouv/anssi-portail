<script lang="ts">
  import { fabriqueFilAriane } from '../../../ui/filAriane';
  import FilAriane from '../../../ui/FilAriane.svelte';
  import ChoixRole from './ChoixRole.svelte';
  import ChoixScenario from './ChoixScenario.svelte';
  import MiseEnSituation from './MiseEnSituation.svelte';
  import { rôles as rôlesDuJeu, type IdRôle } from './roles';
  import { scénarios as scénariosDuJeu, type IdScénario } from './scenarios';
  import ScoreFinalReflexeCyber from './ScoreFinalReflexeCyber.svelte';
  import { prépareAudio } from './simulation/audio';
  import Simulation from './simulation/Simulation.svelte';

  const { urlBase = '', mode }: { urlBase?: string; mode?: 'autonome' } = $props();

  const avecUrlBase = <T extends { image: { src: string; alt: string } }>(éléments: T[]): T[] =>
    éléments.map((élément) => ({
      ...élément,
      image: { ...élément.image, src: `${urlBase}${élément.image.src}` },
    }));
  const scénarios = $derived(avecUrlBase(scénariosDuJeu));
  const rôles = $derived(avecUrlBase(rôlesDuJeu));

  let conteneur: HTMLDivElement | undefined = $state();
  const remonteAuDébut = () => {
    if (mode === 'autonome') {
      conteneur?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    void prépareAudio();
    étape = 'simulation';
  };

  const termineSimulation = () => {
    étape = 'score-final';
  };
</script>

<div
  class="parcours-reflexe-cyber"
  bind:this={conteneur}
  class:simulation={étape === 'simulation'}
  class:score-final={étape === 'score-final'}
>
  {#if mode !== 'autonome'}
    <dsfr-container>
      <FilAriane
        segments={fabriqueFilAriane({
          feuille: 'Réflexe cyber&nbsp;: comment réagirez-vous en cas de cyber&shy;attaque&nbsp;?',
          parents: [{ nom: 'Faire le test !', lien: '/faire-le-test' }],
        })}
      />
    </dsfr-container>
  {:else if étape === 'scénario'}
    <dsfr-container class="entete-autonome">
      <h1>Réflexes Cyber</h1>
    </dsfr-container>
  {/if}

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
      surMontage={remonteAuDébut}
    />
  {:else if étape === 'simulation'}
    <Simulation
      scénario={scénarioSélectionné!}
      rôle={rôleSélectionné!}
      {score}
      {rôles}
      {urlBase}
      surSimulationTerminée={termineSimulation}
    />
  {:else if étape === 'score-final'}
    <ScoreFinalReflexeCyber réponses={score} {urlBase} {mode} surMontage={remonteAuDébut} />
  {/if}
</div>

<style lang="scss">
  .parcours-reflexe-cyber {
    display: flex;
    flex-direction: column;
    background-color: var(--background-alt-blue-france);

    .entete-autonome {
      padding-top: 2rem;
    }

    &.simulation,
    &.score-final {
      background-color: var(--background-default-grey);
    }
  }
</style>
