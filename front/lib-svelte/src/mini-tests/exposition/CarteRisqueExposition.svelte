<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import Modale from '../../ui/Modale.svelte';
  import type { MenaceEvaluee } from './expositionCyberattaques';

  interface Props {
    menace: MenaceEvaluee;
  }

  let { menace }: Props = $props();

  let détailOuvert = $state(false);
</script>

<article class="carte-risque">
  <div class="icone" style:background-color={`var(${menace.couleurFond})`}>
    <lab-anssi-icone nom={menace.icone} taille="lg"></lab-anssi-icone>
  </div>

  {#if menace.renforce}
    <dsfr-badge label="Renforcée" type="status" status="warning" size="sm"></dsfr-badge>
  {/if}

  <h3>{menace.nom}</h3>
  <p class="description">{menace.description}</p>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <dsfr-button
    label="Afficher le détail"
    kind="tertiary"
    size="sm"
    has-icon="true"
    icon="file-text-line"
    onclick={() => (détailOuvert = true)}
  ></dsfr-button>
</article>

<Modale titre={menace.nom} bind:estOuverte={détailOuvert}>
  <p>{menace.description}</p>

  <p class="niveau-risque">
    <strong>Niveau de risque</strong>
    {#if menace.renforce}
      <dsfr-badge label="Renforcée" type="status" status="warning" size="sm"></dsfr-badge>
    {/if}
  </p>

  {#each menace.paragraphesInsight as paragraphe (paragraphe)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p>{@html aseptiseHtml(paragraphe)}</p>
  {/each}
</Modale>

<style lang="scss">
  .carte-risque {
    background-color: var(--background-default-grey);
    border: 1px solid var(--border-default-grey);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    padding: 1.5rem;
  }

  .icone {
    align-items: center;
    border-radius: 0.5rem;
    display: flex;
    height: 4rem;
    justify-content: center;
    width: 4rem;
  }

  h3 {
    margin-bottom: 0;
  }

  .description {
    color: var(--text-default-grey);
    margin-bottom: 0;
  }

  dsfr-button {
    margin-top: auto;
    align-self: flex-start;
  }

  .niveau-risque {
    align-items: center;
    display: flex;
    gap: 0.75rem;
  }
</style>
