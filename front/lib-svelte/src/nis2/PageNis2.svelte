<script lang="ts">
  import { onMount } from 'svelte';
  import Onglets from '../navigation/Onglets.svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import DocumentationNis2 from './DocumentationNis2.svelte';
  import Presentation from './Presentation.svelte';
  import Solutions from './Solutions.svelte';

  let { itemsCyber } = $props();

  let estBureau = $state(false);
  onMount(() => {
    const mql = window.matchMedia('(min-width: 992px)');
    mql.addEventListener('change', (e: MediaQueryListEvent) => {
      estBureau = e.matches;
    });
    estBureau = mql.matches;
  });

  const onglets = [
    {
      label: 'La directive NIS 2',
      fragment: '#presentation',
    },
    {
      label: 'Solutions pour vous accompagner',
      fragment: '#solutions',
    },
    {
      label: 'Documentation',
      fragment: '#documentation',
    },
  ];
  let ongletActif = $state(0);
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
    <FilAriane fondSombre={true} feuille="Directive NIS 2" />
  {/snippet}
  {#snippet actions()}
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
  {/snippet}
</Heros>

<Onglets {onglets} bind:ongletActif />

{#if ongletActif === 0}
  <Presentation />
{:else if ongletActif === 1}
  <Solutions {itemsCyber} />
{:else if ongletActif === 2}
  <DocumentationNis2 />
{/if}

<style lang="scss">
</style>
