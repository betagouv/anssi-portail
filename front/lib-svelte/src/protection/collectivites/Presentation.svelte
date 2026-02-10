<script lang="ts">
  import Onglets from '../../nis2/Onglets.svelte';
  import FilAriane from '../../ui/FilAriane.svelte';
  import Heros from '../../ui/Heros.svelte';
  import Proteger from '../Proteger.svelte';
  import Solutions from './Solutions.svelte';

  let { itemsCyber } = $props();

  const onglets = [
    {
      label: 'Protéger ma collectivité',
      fragment: '#proteger',
    },
    {
      label: 'Toutes les solutions pour m’aider',
      fragment: '#solutions',
    },
  ];
  let ongletActif = $state(0);
</script>

<Heros
  format="heros"
  theme="sombre"
  cacheTags
  titre="Protéger ma collectivité contre les cyberattaques"
  description="Les collectivités sont exposées aux cyberattaques, notamment aux rançongiciels. En 2024, elles ont représenté 17 % des cibles de rançongiciels, ce qui en fait le deuxième type d’entités le plus visé."
  cacheActions
  illustrationSource="/assets/images/personne-qui-cogite.svg"
  illustrationAlt=""
  cacheIllustration={false}
>
  {#snippet filAriane()}
    <FilAriane fondSombre={true} feuille="Protéger ma collectivité" />
  {/snippet}
</Heros>

<Onglets {onglets} bind:ongletActif />

{#if ongletActif === 0}
  <Proteger />
{:else}
  <Solutions {itemsCyber} />
{/if}
