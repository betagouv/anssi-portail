<script lang="ts">
  import { aseptiseHtml } from '$plateforme/aseptisationDuHtml';
  import { clic } from '../../../../directives/actions.svelte';
  import Bouton from '../../../../ui/Bouton.svelte';
  import CanonAConfetti from '../../../../ui/CanonAConfetti.svelte';
  import Minuteur from '../Minuteur.svelte';
  import type { Rôle } from '../roles';
  import type { Évènement } from './evenements';
  import type { Réflexe } from './reflexes';

  type Props = {
    évènement: Évènement;
    réflexe: Réflexe;
    rôle: Rôle;
    surÉvènementSuivant: () => void;
    choixEnCours: boolean;
    surBonRéflexe: () => void;
    surMauvaisRéflexe: () => void;
  };

  let {
    évènement,
    réflexe,
    rôle,
    surÉvènementSuivant,
    choixEnCours = $bindable(),
    surBonRéflexe,
    surMauvaisRéflexe,
  }: Props = $props();

  let actionsMasquées = $state(true);
  let statutRéflexe = $state<'en attente' | 'bon' | 'mauvais' | 'temps écoulé'>('en attente');

  $effect(() => {
    choixEnCours = !actionsMasquées && statutRéflexe === 'en attente';
  });

  const passeÉvènementSuivant = () => {
    statutRéflexe = 'en attente';
    actionsMasquées = true;
    surÉvènementSuivant();
  };
</script>

<div class="contexte">
  <div class="titre">
    <dsfr-tag label={évènement.heure} type="default" size="md" has-icon icon="time-fill"></dsfr-tag>
    <h2 class="fr-h3" id="titre-evenement">{évènement.titre}</h2>
  </div>

  <div class="texte-evenement fr-text--md">
    {#each évènement.contexte as élément (élément)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <p>{@html aseptiseHtml(élément)}</p>
    {/each}
  </div>
</div>

{#if actionsMasquées}
  <Bouton libelle="Afficher les actions" taille="md" surClic={() => (actionsMasquées = false)} />
{:else}
  <div class="choix">
    <div class="entete-choix">
      <img src={rôle.image.src} alt={rôle.image.alt} />
      <h3 class="fr-h6">Sélectionnez le bon réflexe</h3>
    </div>
    <div class="options" role="radiogroup" aria-label="Réflexes proposés">
      <label class:desactive={statutRéflexe === 'mauvais'}>
        <input
          type="radio"
          name="reflexe"
          value="bon"
          bind:group={statutRéflexe}
          disabled={statutRéflexe === 'mauvais'}
          use:clic={surBonRéflexe}
        />
        <span>{réflexe.proposition.bonRéflexe}</span>
      </label>
      <label class:desactive={statutRéflexe === 'bon'}>
        <input
          type="radio"
          name="reflexe"
          value="mauvais"
          bind:group={statutRéflexe}
          disabled={statutRéflexe === 'bon'}
          use:clic={surMauvaisRéflexe}
        />
        <span>{réflexe.proposition.mauvaisRéflexe}</span>
      </label>
    </div>
  </div>

  <Minuteur />

  {#if statutRéflexe === 'bon'}
    <dsfr-alert title="Bon réflexe !" text={réflexe.conséquence.bonRéflexe} type="success" size="md" has-description
    ></dsfr-alert>
    <CanonAConfetti lectureAutomatique />
  {:else if statutRéflexe === 'mauvais'}
    <dsfr-alert title="Mauvais réflexe" text={réflexe.conséquence.mauvaisRéflexe} type="error" size="md" has-description
    ></dsfr-alert>
  {:else if statutRéflexe === 'temps écoulé'}
    <dsfr-alert
      title="Temps écoulé"
      text="Le temps imparti est écoulé. En situation de crise, l’absence de décision laisse les impacts s’aggraver : ce tour est compté comme un mauvais réflexe."
      type="error"
      size="md"
      has-description
    ></dsfr-alert>
  {/if}

  {#if statutRéflexe !== 'en attente'}
    <Bouton libelle="Événement suivant" taille="md" surClic={passeÉvènementSuivant} />
  {/if}
{/if}

<style lang="scss">
  .contexte,
  .titre {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .contexte {
    gap: 1.5rem;

    .titre {
      align-items: flex-start;
      gap: 0.5rem;

      h2 {
        margin: 0;
        color: var(--text-title-blue-france);
      }
    }

    .texte-evenement {
      width: 100%;

      p {
        margin: 0 0 1.5rem;
      }

      > :last-child {
        margin-bottom: 0;
      }
    }
  }

  .choix {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    background-color: var(--background-alt-blue-france);

    .entete-choix {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      img {
        border-radius: 999px;
        object-fit: cover;
        object-position: center;
        border: 2px solid white;
        width: 3.75rem;
        height: 3.75rem;
      }

      h3 {
        margin: 0;
      }
    }

    .options {
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 1rem;

      label {
        display: flex;
        min-height: 3rem;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border-default-grey);
        background-color: var(--background-default-grey);
        cursor: pointer;

        &.desactive {
          color: var(--text-disabled-grey);
          cursor: not-allowed;
        }
        &:has(input[type='radio']:checked) {
          border: 1px solid var(--border-active-blue-france);
        }
      }

      input {
        flex: 0 0 auto;
        width: 1rem;
        height: 1rem;
        margin: 0;
        accent-color: var(--background-action-high-blue-france);
      }
    }
  }

  dsfr-alert {
    width: 100%;
  }
</style>
