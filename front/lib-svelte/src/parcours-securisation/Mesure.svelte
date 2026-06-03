<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import { aseptiseHtml } from '../utils/aseptisationDuHtml';
  import type { Mesure } from './mesure';

  let mesure: Mesure | undefined = undefined;

  onMount(async () => {
    const chemin = new URL(window.location.href).pathname;
    const idMesureACharger = chemin.split('/').reverse()[0];
    const reponse = await axios.get<Mesure>(`/api/mesures/${idMesureACharger}`);
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
    titre={mesure.phraseAccroche}
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
    <section class="presentation">
      <h2>Présentation</h2>
      {@html explications}
    </section>
  </dsfr-container>

  {#if mesure.risques.length > 0}
    <dsfr-container>
      <section class="risques">
        <h2>Risques evites</h2>
        <ul class="risques-list">
          {#each mesure.risques as risque}
            <li>
              <strong>{risque.libelle}</strong>
              <p>{risque.description}</p>
            </li>
          {/each}
        </ul>
      </section>
    </dsfr-container>
  {/if}
{:else}
  <dsfr-container>Chargement... </dsfr-container>
{/if}
