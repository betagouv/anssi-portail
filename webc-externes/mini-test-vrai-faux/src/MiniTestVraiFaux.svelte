<svelte:options
  customElement={{
    tag: 'lab-anssi-mini-test-vrai-faux',
    shadow: 'none',
  }}
/>

<script lang="ts">
  import LandingVraiFaux from '@anssi-portail/svelte/src/mini-tests/vrai-faux/LandingVraiFaux.svelte';
  import QuizVraiFaux from '@anssi-portail/svelte/src/mini-tests/vrai-faux/moteur-de-jeu/QuizVraiFaux.svelte';

  let quizAffiché = $state(false);

  const afficheLeQuizz = () => {
    quizAffiché = true;
  };
  const urlBase = import.meta.env.VITE_API_URL;
</script>

<div class="lab-anssi-mini-test-vrai-faux" data-themeable={true}>
  {#if quizAffiché}
    <QuizVraiFaux {urlBase} />
  {:else}
    <LandingVraiFaux {urlBase} mode="autonome" suivant={afficheLeQuizz} />
  {/if}
</div>

<style lang="scss">
  .lab-anssi-mini-test-vrai-faux {
    font-family: Marianne, Arial, sans-serif;
    font-size: 1rem;
    font-weight: normal;
  }
</style>
