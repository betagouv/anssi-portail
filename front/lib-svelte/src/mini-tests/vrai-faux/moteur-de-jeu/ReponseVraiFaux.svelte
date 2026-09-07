<script lang="ts">
  import Bouton from '../../../ui/Bouton.svelte';
  import CanonAConfetti from '../../../ui/CanonAConfetti.svelte';
  import type { IdéeReçue } from './QuizVraiFaux.svelte';

  const {
    mode,
    indexIdéeReçue,
    idéeReçue,
    nombreIdéesReçues,
    suivant,
    obtenirScore,
  }: {
    mode: 'bonne-réponse' | 'mauvaise-réponse';
    indexIdéeReçue: number;
    idéeReçue: IdéeReçue;
    nombreIdéesReçues: number;
    suivant: () => void;
    obtenirScore: () => void;
  } = $props();

  const badge = $derived.by(() => {
    switch (mode) {
      case 'bonne-réponse':
        return { label: 'Bonne réponse', status: 'success' };
      case 'mauvaise-réponse':
        return { label: 'Mauvaise réponse', status: 'error' };
      default:
        return { label: '', status: '' };
    }
  });
</script>

<div class="réponse">
  <dsfr-badge label={badge.label} size="md" type="status" status={badge.status}></dsfr-badge>
  <dsfr-tag class="compte" size="md" label="{indexIdéeReçue + 1}/{nombreIdéesReçues}"></dsfr-tag>
  <h2 class="fr-h6">{idéeReçue.réponse}</h2>
  {#each idéeReçue.explications as explication, index (index)}
    <p>{explication}</p>
  {/each}
  <hr />
  <p class="texte-mention-xs">Source : {idéeReçue.source}</p>
  {#if indexIdéeReçue === nombreIdéesReçues - 1}
    <Bouton libelle="Obtenir mon score" surClic={obtenirScore} />
  {:else}
    <Bouton libelle="Suivant" surClic={suivant} icone="arrow-right-line" iconeADroite />
  {/if}
</div>
{#if mode === 'bonne-réponse'}
  <CanonAConfetti lectureAutomatique={true} />
{/if}

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;
  @use '../../../../../assets/styles/grille.scss' as *;

  .réponse {
    align-items: center;
    background: var(--background-default-grey);
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-flow: row wrap;
    row-gap: 1.5rem;
    grid-template-columns: 1fr auto;
    padding: 2rem;
    justify-content: space-between;
    margin-bottom: 4.5rem;

    @include a-partir-de(md) {
      margin-inline: auto;
      width: taille-pour-colonnes(10);
    }

    @include a-partir-de(lg) {
      margin-inline: auto;
      width: taille-pour-colonnes(6);
    }

    :nth-child(0) {
      flex: 1 100%;
    }

    :nth-child(1) {
      flex: 0 1 auto;
    }

    h2,
    p,
    hr {
      flex: 1 0 100%;
      margin: 0;
    }

    hr {
      height: 1px;
      border: 0;
      background-color: var(--border-default-grey);
    }

    :global(:last-child) {
      margin-inline: auto;
    }
  }
</style>
