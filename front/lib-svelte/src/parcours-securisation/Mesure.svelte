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
      <h2>Les risques évités</h2>
      <ul class="risques-list">
        {#each mesure.risques as risque (risque.libelle)}
          <li>
            <strong>{risque.libelle}&nbsp;:</strong>
            {risque.description}
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
      {#if mesure.actionFacileAFaire}
        <dsfr-highlight size="md" text="slot">
          <h3 slot="title">Bonne nouvelle&nbsp;!</h3>
          <p slot="text">{mesure.actionFacileAFaire}</p>
        </dsfr-highlight>
      {/if}
    </div>

    <div class="contenu-section comment-faire">
      <h2>Comment faire concrètement</h2>
      <dsfr-card
        hasBadge
        title={mesure.tutoriel?.titre ?? 'Titre'}
        horizontal
        actionMarkup="button"
        src={mesure.tutoriel?.image ?? '/assets/images/image-generique.avif'}
        imageRatio="1x1"
        horizontalProportion="tier"
        size="lg"
      >
        <dsfr-badge slot="badgesgroup" label="Tutoriel" type="accent" accent="purple-glycine"></dsfr-badge>
      </dsfr-card>
      {#if mesure.liensPourAllerPlusLoin?.length > 0}
        <div class="section-aide">
          <p class="texte-article-lg">Pour aller plus loin</p>
          {#each mesure.liensPourAllerPlusLoin as lien (lien.libelle)}
            <msc-lien href={lien.url} libelle={lien.libelle}></msc-lien>
          {/each}
        </div>
      {/if}
    </div>
  </dsfr-container>
{:else}
  <dsfr-container>Chargement... </dsfr-container>
{/if}

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  .contenu-section {
    margin-bottom: 2rem;

    ul {
      padding-left: 1.75rem;
    }

    &.priorites {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      background-color: var(--background-alt-blue-cumulus);
      border-radius: 6px;

      h2 {
        margin: 0;

        lab-anssi-icone {
          margin-right: 0.5rem;
        }
      }

      h3 {
        margin: 0 0 0.5rem;
      }

      p {
        margin: 0;
      }
    }

    dsfr-card {
      min-height: 0;
      margin-bottom: 1.5rem;

      dsfr-badge {
        margin-bottom: 0.75rem;
      }
    }

    .section-aide {
      margin-bottom: 3rem;

      .texte-article-lg {
        font-weight: bold;
        color: var(--text-title-grey);
      }

      hr {
        margin-block: 1rem;
        height: 1px;
        border: 0;
        background-color: var(--border-default-grey);
        &:last-of-type {
          display: none;
        }
      }
    }

    .recyf > p {
      margin-bottom: 1.5rem;
    }
  }
</style>
