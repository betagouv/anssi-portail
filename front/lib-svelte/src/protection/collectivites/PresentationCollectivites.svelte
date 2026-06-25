<script lang="ts">
  import NavigationTertiaire from '../../navigation/NavigationTertiaire.svelte';
  import Proteger from '../Proteger.svelte';
  import Solutions from './Solutions.svelte';

  let { itemsCyber } = $props();

  const liens = [
    {
      label: 'Protéger ma collectivité',
      fragment: '#proteger',
    },
    {
      label: 'Toutes les solutions pour m’aider',
      fragment: '#solutions',
    },
  ];
  let lienActif = $state('#proteger');
</script>

<NavigationTertiaire {liens} bind:lienActif />

{#if lienActif === '#proteger'}
  <Proteger origine="landing-collectivites" />
{:else}
  <Solutions {itemsCyber} />
{/if}
