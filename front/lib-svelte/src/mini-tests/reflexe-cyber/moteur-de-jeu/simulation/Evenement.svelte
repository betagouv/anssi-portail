<script lang="ts">
  import type { Action } from 'svelte/action';
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
    surTempsÉcoulé: () => void;
    dernierÉvènement: boolean;
  };

  let {
    évènement,
    réflexe,
    rôle,
    surÉvènementSuivant,
    choixEnCours = $bindable(),
    surBonRéflexe,
    surMauvaisRéflexe,
    surTempsÉcoulé,
    dernierÉvènement,
  }: Props = $props();

  let actionsMasquées = $state(true);
  let animationTexteEnCours = $state(false);
  let statutRéflexe = $state<'en attente' | 'bon' | 'mauvais' | 'temps écoulé'>('en attente');

  $effect(() => {
    choixEnCours = !actionsMasquées && statutRéflexe === 'en attente';
  });

  const passeÉvènementSuivant = () => {
    statutRéflexe = 'en attente';
    actionsMasquées = true;
    surÉvènementSuivant();
  };

  const aLaisséPasserLeTemps = () => {
    statutRéflexe = 'temps écoulé';
    surTempsÉcoulé();
  };

  const choixBonRéflexeDésactivé = $derived(['mauvais', 'temps écoulé'].includes(statutRéflexe));
  const choixMauvaisRéflexeDésactivé = $derived(['bon', 'temps écoulé'].includes(statutRéflexe));

  const machineÀÉcrire: Action<HTMLElement> = (nœud) => {
    const mouvementRéduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mouvementRéduit) return;
    animationTexteEnCours = true;

    const vitesse = 15;

    const éléments = nœud.querySelectorAll('*');
    éléments.forEach((élément) => {
      (élément as HTMLElement).style.visibility = 'hidden';
    });

    const nœudsDeTexte: { référence: Text; texteComplet: string }[] = [];
    const parcoureur = document.createTreeWalker(nœud, NodeFilter.SHOW_TEXT);
    let nœudCourant: Text | null;

    while ((nœudCourant = parcoureur.nextNode() as Text | null)) {
      nœudsDeTexte.push({
        référence: nœudCourant,
        texteComplet: nœudCourant.textContent || '',
      });
      nœudCourant.textContent = '';
    }

    let indexNœud = 0;
    let indexCaractère = 0;

    const intervalle = setInterval(() => {
      if (indexNœud >= nœudsDeTexte.length) {
        clearInterval(intervalle);
        animationTexteEnCours = false;
        return;
      }

      const cible = nœudsDeTexte[indexNœud];

      let parent = cible.référence.parentElement;
      while (parent && parent !== nœud) {
        parent.style.visibility = 'visible';
        parent = parent.parentElement;
      }

      indexCaractère++;
      cible.référence.textContent = cible.texteComplet.slice(0, indexCaractère);

      if (indexCaractère >= cible.texteComplet.length) {
        indexNœud++;
        indexCaractère = 0;
      }
    }, vitesse);

    return {
      destroy() {
        clearInterval(intervalle);
      },
    };
  };
</script>

<div class="contexte">
  <div class="titre">
    <dsfr-tag label={évènement.heure} type="default" size="md" has-icon icon="time-fill"></dsfr-tag>
    <h2 class="fr-h3" id="titre-evenement">{évènement.titre}</h2>
  </div>
  {#key évènement}
    <div class="texte-evenement fr-text--md" use:machineÀÉcrire>
      {#each évènement.contexte as élément (élément)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        <p>{@html aseptiseHtml(élément)}</p>
      {/each}
    </div>
  {/key}
</div>

{#if actionsMasquées}
  {#if !animationTexteEnCours}
    <Bouton libelle="Afficher les actions" taille="md" surClic={() => (actionsMasquées = false)} />
  {/if}
{:else}
  <div class="choix">
    <div class="entete-choix">
      <img src={rôle.image.src} alt={rôle.image.alt} />
      <h3 class="fr-h6">Sélectionnez le bon réflexe</h3>
    </div>
    <div class="options" class:ordre-inverse={Math.random() < 0.5} role="radiogroup" aria-label="Réflexes proposés">
      <label class:desactive={choixBonRéflexeDésactivé}>
        <input
          type="radio"
          name="reflexe"
          value="bon"
          bind:group={statutRéflexe}
          disabled={choixBonRéflexeDésactivé}
          use:clic={surBonRéflexe}
        />
        <span>{réflexe.proposition.bonRéflexe}</span>
      </label>
      <label class:desactive={choixMauvaisRéflexeDésactivé}>
        <input
          type="radio"
          name="reflexe"
          value="mauvais"
          bind:group={statutRéflexe}
          disabled={choixMauvaisRéflexeDésactivé}
          use:clic={surMauvaisRéflexe}
        />
        <span>{réflexe.proposition.mauvaisRéflexe}</span>
      </label>
    </div>
  </div>

  <Minuteur actif={choixEnCours} surTempsÉcoulé={aLaisséPasserLeTemps} />

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
    <Bouton
      libelle={dernierÉvènement ? 'Obtenir mon résultat' : 'Événement suivant'}
      taille="md"
      surClic={passeÉvènementSuivant}
    />
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

      &.ordre-inverse {
        flex-direction: column-reverse;
      }

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
