<script lang="ts">
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import axios from 'axios';
  import type { Mesure } from './mesure';

  let mesure: Mesure | undefined = undefined;

  onMount(async () => {
    const reponse = await axios.get<Mesure>('/api/mesures/AUTH.5');
    mesure = reponse.data;
  });
</script>

{#if mesure}
  <Heros
    cacheActions={true}
    cacheIllustration={false}
    cacheTags={true}
    description={mesure.titre}
    illustrationSource="/assets/images/parcours-securisation/mesure-{mesure.id}.svg"
    illustrationAlt=""
    format="details"
    titre={mesure.phrase_accroche}
    theme="clair"
  >
    {#snippet filAriane()}
      <FilAriane
        feuille="placeholder"
        branche={{
          nom: 'Protéger mon organisation',
          lien: '/',
        }}
      ></FilAriane>
    {/snippet}
  </Heros>

  <dsfr-container>
    <div>A faire...</div>
  </dsfr-container>
{:else}
  <dsfr-container>Chargement... </dsfr-container>
{/if}
