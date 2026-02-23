<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import DocumentationNis2 from './DocumentationNis2.svelte';
  import ExigencesNis2 from './ExigencesNis2.svelte';
  import Presentation from './Presentation.svelte';
  import Solutions from './Solutions.svelte';
  import NavigationTertiaire from '../navigation/NavigationTertiaire.svelte';

  let { itemsCyber, featureFlagNis2 = false } = $props();

  let estBureau = $state(false);
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const liens = [
    {
      label: 'Présentation NIS 2',
      fragment: '#presentation',
    },
    { label: 'Exigences et comparaison', fragment: '#exigences' },
    {
      label: 'Solutions pour vous accompagner',
      fragment: '#solutions',
    },
    {
      label: 'Documentation et FAQ',
      fragment: '#documentation',
    },
  ];
  let lienActif = $state('#presentation');
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags={true}
  titre="Directive NIS 2"
  description="Préparez-vous et renforcez dès à présent le niveau de cybersécurité de votre organisation."
  cacheActions={false}
  illustrationSource="/assets/images/nis2.svg"
  illustrationAlt="NIS2"
  cacheIllustration={!estBureau}
>
  {#snippet filAriane()}
    {#if featureFlagNis2}
      <FilAriane fondSombre={true} feuille="Directive NIS 2" />
    {:else}
      <FilAriane fondSombre={true} feuille="Vous accompagner avec NIS2" />
    {/if}
  {/snippet}
  {#snippet actions()}
    {#if featureFlagNis2}
      <dsfr-button
        label="Pré-enregistrer mon entité"
        markup="a"
        href="https://club.ssi.gouv.fr/#/nis2/introduction"
        target="_blank"
        has-icon
        icon-place="right"
        icon="external-link-line"
        centered
      ></dsfr-button>
    {/if}
  {/snippet}
</Heros>

{#if featureFlagNis2}
  <NavigationTertiaire {liens} bind:lienActif />
{/if}

<div class="contenu">
  {#if featureFlagNis2}
    {#if lienActif === '#presentation'}
      <Presentation />
    {:else if lienActif === '#exigences'}
      <ExigencesNis2 />
    {:else if lienActif === '#solutions'}
      <Solutions {itemsCyber} />
    {:else if lienActif === '#documentation'}
      <DocumentationNis2 />
    {/if}
  {:else}
    <Solutions {itemsCyber} />
  {/if}
</div>

<style lang="scss">
  .contenu {
    margin-top: 48px;
  }
</style>
