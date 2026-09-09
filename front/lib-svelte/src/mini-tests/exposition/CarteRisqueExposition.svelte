<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import Bouton from '../../ui/Bouton.svelte';
  import Modale from '../../ui/Modale.svelte';
  import type { MenaceEvaluee } from './expositionCyberattaques';

  interface Props {
    menace: MenaceEvaluee;
  }

  let { menace }: Props = $props();

  let détailOuvert = $state(false);
</script>

<div class="carte-et-modale">
  <dsfr-card
    title={menace.nom}
    has-description
    description={menace.description}
    has-buttons
    has-detail-end
    detail-end=""
    has-badge={menace.renforce || undefined}
    no-link
    size="md"
  >
    <div slot="image" class={['icone', menace.couleurFond]}>
      <img src={menace.icone} alt="" />
    </div>
    {#if menace.renforce}
      <div slot="badgesgroup">
        <dsfr-badge label="renforcée" type="status" status="warning" size="md"></dsfr-badge>
      </div>
    {/if}
    {#if menace.resume}
      <div slot="contentend" class="stats">
        <p class="pourcentage fr-h4">{menace.resume.indicateur}</p>
        {#if menace.resume.enHausse}
          <dsfr-badge
            has-icon
            icon="arrow-right-up-line"
            type="accent"
            accent="green-emeraude"
            size="sm"
            label="en hausse"
          ></dsfr-badge>
        {/if}
        <p class="texte-detail-sm">{menace.resume.texte}</p>
      </div>
    {/if}
    <div slot="buttonsgroup">
      <Bouton
        libelle="Afficher le détail"
        type="secondaire"
        icone="file-text-line"
        surClic={() => (détailOuvert = true)}
      />
    </div>
  </dsfr-card>

  <Modale titre={menace.nom} bind:estOuverte={détailOuvert}>
    <p class="texte-standard-md">{menace.description}</p>

    {#if menace.renforce}
      <p class="texte-standard-md niveau-risque">
        <strong>Niveau de risque</strong>
        <dsfr-badge label="Renforcée" type="status" status="warning" size="sm"></dsfr-badge>
      </p>
    {/if}

    {#if menace.resume}
      <div class="stats">
        <p class="pourcentage fr-h4">{menace.resume.indicateur}</p>
        {#if menace.resume.enHausse}
          <dsfr-badge
            has-icon
            icon="arrow-right-up-line"
            type="accent"
            accent="green-emeraude"
            size="sm"
            label="en hausse"
          ></dsfr-badge>
        {/if}
        <p class="texte-detail-sm">{menace.resume.texte}</p>
      </div>
    {/if}
    {#each menace.paragraphesInsight as paragraphe (paragraphe)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <p class="texte-standard-md">{@html aseptiseHtml(paragraphe)}</p>
    {/each}
  </Modale>
</div>

<style lang="scss">
  .carte-et-modale {
    display: flex;
    .icone {
      align-items: center;
      border-radius: 0.5rem;
      display: flex;
      height: 4rem;
      justify-content: center;
      width: 4rem;

      margin: 2rem 0 0 2rem;

      &.jaune {
        background-color: var(--background-alt-yellow-tournesol);
      }

      &.bleu {
        background-color: var(--background-alt-blue-france);
      }

      &.bleu-clair {
        background-color: var(--background-alt-blue-cumulus);
      }

      &.pourpre {
        background-color: var(--background-alt-purple-glycine);
      }

      &.rose {
        background-color: var(--background-alt-pink-tuile);
      }

      img {
        width: 2.5rem;
        height: 2.5rem;
      }
    }

    .stats {
      display: grid;
      grid-template-columns: auto 1fr;
      padding: 0.75rem;
      gap: 0.25rem 0.5rem;
      background-color: var(--background-alt-brown-cafe-creme);

      .pourcentage {
        margin: 0;
        color: var(--text-title-blue-france);
      }

      dsfr-badge {
        align-self: center;
      }

      .texte-detail-sm {
        color: var(--text-mention-grey);
        margin: 0;
        grid-column: 1/-1;
      }
    }

    .niveau-risque {
      align-items: flex-end;
      display: flex;
      gap: 0.75rem;
    }
    .texte-standard-md + .stats {
      margin-bottom: 1.5rem;
    }
  }
</style>
