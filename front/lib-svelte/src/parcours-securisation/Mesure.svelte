<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import FilAriane from '../ui/FilAriane.svelte';
  import Heros from '../ui/Heros.svelte';
  import { aseptiseHtml } from '../utils/aseptisationDuHtml';
  import type { Mesure } from './mesure';

  let mesure: Mesure | undefined = $state();

  onMount(async () => {
    const chemin = new URL(window.location.href).pathname;
    const idMesureACharger = chemin.split('/').reverse()[0];
    const reponse = await axios.get<Mesure>(`/api/mesures/${idMesureACharger}`);
    mesure = reponse.data;
  });

  let explications = $derived(mesure ? aseptiseHtml(mesure.explications) : '');
  let actionPrioritaire = $derived(mesure ? aseptiseHtml(mesure.actionPrioritaire) : '');
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
    <div class="contenu-section">
      <h2>Présentation</h2>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html explications}
    </div>

    <div class="contenu-section">
      <h2>Risques evites</h2>
      <ul class="risques-list">
        {#each mesure.risques as risque (risque.libelle)}
          <li>
            <p><strong>{risque.libelle}&nbsp;:</strong> {risque.description}</p>
          </li>
        {/each}
      </ul>
    </div>

    <div class="contenu-section priorites">
      <h2><lab-anssi-icone nom="arrow-right-line"></lab-anssi-icone>À faire en priorité</h2>
      <div>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <p>{@html actionPrioritaire}</p>
      </div>
    </div>
  </dsfr-container>
{:else}
  <dsfr-container>Chargement... </dsfr-container>
{/if}

<style lang="scss">
  .contenu-section {
    margin-bottom: 2rem;

    &.priorites {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      background-color: var(--background-alt-blue-cumulus);
      border-radius: 6px;
    }
  }
</style>
