<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BoutonFermerModale from '../ui/BoutonFermerModale.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import ZoneTexte from '../ui/ZoneTexte.svelte';
  import { entrepotNavigateurAvisUtilisateur } from './ControleAvisUtilisateur';

  export let featureFlagAvisUtilisateur: boolean = false;

  let encartOuvert = false;
  let dialogue: HTMLDialogElement;
  let afficheDialogue: boolean = false;
  let etape: 'formulaire' | 'merci' = 'formulaire';

  type SatisfactionDisponible = '1' | '2' | '3' | '4' | '5';
  let satisfaction: SatisfactionDisponible | undefined;
  let erreurSatisfaction = false;
  let commentaire: string | undefined;
  let erreurCommentaire = false;
  let emailDeContact: string | undefined;

  $: {
    if (satisfaction) erreurSatisfaction = false;
    if (commentaire) erreurCommentaire = false;
  }

  const surCliqueCTA = () => {
    encartOuvert = false;
    afficheDialogue = true;
  };

  const surFermetureCTA = () => {
    encartOuvert = false;
    entrepotNavigateurAvisUtilisateur.modifieDateDerniereFermetureAvis(
      new Date()
    );
  };

  const soumetsLeFormulaire = async () => {
    if (!satisfaction) erreurSatisfaction = true;
    if (!commentaire) erreurCommentaire = true;
    if (erreurCommentaire || erreurSatisfaction) return;

    try {
      await axios.post('/api/avis-utilisateur', {
        niveauDeSatisfaction: Number(satisfaction),
        commentaire,
        emailDeContact,
      });
    } catch (erreur) {
      console.error(erreur);
    } finally {
      entrepotNavigateurAvisUtilisateur.modifieDateDernierAvisDonne(new Date());
      etape = 'merci';
    }
  };

  onMount(() => {
    encartOuvert = !RegExp(/(\/?)(cyberdepart|test-maturite)(\/?)$/).exec(
      window.location.pathname
    );
  });
  $: {
    if (dialogue) {
      if (afficheDialogue) {
        dialogue.showModal();
      } else {
        entrepotNavigateurAvisUtilisateur.modifieDateDerniereFermetureAvis(
          new Date()
        );
        dialogue.close();
      }
    }
  }
</script>

{#if featureFlagAvisUtilisateur && encartOuvert}
  <div
    class="avis-utilisateur-cta"
    transition:fly={{ duration: 1000, x: 140, opacity: 1 }}
  >
    <button
      class="zone-cliquable"
      on:click={surCliqueCTA}
      on:keypress
      tabindex={null}
    >
      <div class="illustration">
        <img src="/assets/images/dragon-coeur.svg" alt="Dragon coeur" />
      </div>
      <p class="texte">Votre avis nous intéresse&nbsp;!</p>
    </button>
    <button
      on:keypress
      on:click={surFermetureCTA}
      tabindex={null}
      aria-label="Fermer"
      class="fermer"
    >
      <lab-anssi-icone nom="close-line" taille="sm"></lab-anssi-icone>
    </button>
  </div>
{/if}
{#if featureFlagAvisUtilisateur && afficheDialogue}
  <dialog
    class="dialogue-avis-utilisateur"
    on:close={() => (afficheDialogue = false)}
    bind:this={dialogue}
    transition:fade={{ duration: 500 }}
  >
    {#if etape === 'formulaire'}
      <div class="contenu">
        <BoutonFermerModale on:click={() => dialogue.close()} />
        <h4>Votre avis nous intéresse&nbsp;!</h4>
        {#if erreurSatisfaction || erreurCommentaire}
          <lab-anssi-alerte
            type="erreur"
            description="Merci de compléter les champs avant d’envoyer votre avis."
            fermable={false}
          ></lab-anssi-alerte>
        {/if}
        <div class="question">
          <p class:erreur={erreurSatisfaction}>
            Le service MesServicesCyber répond-il à vos attentes&nbsp;?
          </p>
          <div class="satisfaction">
            <div class="niveaux-satisfaction">
              <input
                id="pas-du-tout"
                type="radio"
                name="note"
                value="1"
                bind:group={satisfaction}
              />
              <label class="niveau-satisfaction" for="pas-du-tout">
                <span aria-label="Pas du tout" role="img">😠</span>
              </label>
              <input
                id="pas-satisfait"
                type="radio"
                name="note"
                value="2"
                bind:group={satisfaction}
              />
              <label class="niveau-satisfaction" for="pas-satisfait">
                <span aria-label="Pas satisfait" role="img">☹️</span>
              </label>
              <input
                id="moyennement-satisfait"
                type="radio"
                name="note"
                value="3"
                bind:group={satisfaction}
              />
              <label class="niveau-satisfaction" for="moyennement-satisfait">
                <span aria-label="Moyennement satisfait" role="img">😕</span>
              </label>
              <input
                id="satisfait"
                type="radio"
                name="note"
                value="4"
                bind:group={satisfaction}
              />
              <label class="niveau-satisfaction" for="satisfait">
                <span aria-label="Satisfait" role="img">😊</span>
              </label>
              <input
                id="tout-a-fait"
                type="radio"
                name="note"
                value="5"
                bind:group={satisfaction}
              />
              <label class="niveau-satisfaction" for="tout-a-fait">
                <span aria-label="Tout à fait" role="img">🤩</span>
              </label>
            </div>
            <div class="descriptions">
              <span class="premier">Pas du tout</span>
              <span class="dernier">Tout à fait</span>
            </div>
          </div>
        </div>
        <div class="question">
          <p class:erreur={erreurCommentaire}>Que pouvons-nous améliorer ?</p>
          <ZoneTexte bind:valeur={commentaire} enErreur={erreurCommentaire} />
        </div>
        <p class="mis-en-avant">
          Échangez avec nous sur votre expérience et participez aux futures
          évolutions de la plateforme&nbsp;!
        </p>
        <div class="question">
          <p>Email de contact (facultatif)</p>
          <ChampTexte
            aideSaisie="Ex : jean.dupont@mail.com"
            id="email-contact"
            nom="email"
            type="email"
            messageErreur="L'email est invalide"
            bind:valeur={emailDeContact}
          />
          <p class="information">
            Votre email ne sera utilisé que pour échanger sur la plateforme et
            ses futures évolutions.
          </p>
        </div>
      </div>
      <footer class="actions">
        <lab-anssi-bouton
          on:click={soumetsLeFormulaire}
          on:keypress
          role="button"
          taille="md"
          tabindex="0"
          titre="Envoyer"
          variante="primaire"
          type="submit"
          largeur-maximale
        ></lab-anssi-bouton>
        <lab-anssi-bouton
          on:click={() => dialogue.close()}
          on:keypress
          role="button"
          taille="md"
          tabindex={1}
          titre="Fermer sans répondre"
          variante="secondaire"
          largeur-maximale
        ></lab-anssi-bouton>
      </footer>
    {:else}
      <div class="contenu">
        <BoutonFermerModale on:click={() => dialogue.close()} />
        <h4>
          Merci 🤩&nbsp;! Vos remarques sont précieuses pour faire évoluer le
          service.
        </h4>
        <p>
          Si vous avez renseigné votre adresse email, nous vous recontacterons
          très prochainement pour échanger sur la plateforme et ses futures
          évolutions.
        </p>
      </div>
      <footer class="actions">
        <lab-anssi-bouton
          on:click={() => dialogue.close()}
          on:keypress
          role="button"
          taille="md"
          tabindex={0}
          titre="Terminer"
          variante="primaire"
          largeur-maximale
        ></lab-anssi-bouton>
      </footer>
    {/if}
  </dialog>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .avis-utilisateur-cta {
    background-color: var(--background-default-grey);
    border-radius: 8px 0 0 8px;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 208px;
    width: 124px;
    z-index: 11;

    .fermer {
      cursor: pointer;
      background: transparent;
      border: 1px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
      margin: 2px 4px;

      &:focus-visible {
        outline: 2px solid var(--bleu-contour-mis-en-valeur);
        outline-offset: 2px;
      }

      &:hover {
        border-color: rgba(0, 0, 0, 0.1);
      }
      &:active {
        border-color: rgba(0, 0, 0, 0.2);
      }
    }
    .zone-cliquable {
      cursor: pointer;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 8px 0 0 8px;

      &:focus-visible {
        outline: 2px solid var(--bleu-contour-mis-en-valeur);
        outline-offset: 2px;
      }

      &:hover {
        background-color: var(--controle-segmente-fond-hover);
      }

      &:active {
        background-color: var(--controle-segmente-fond-clique);
      }

      .illustration {
        background-color: var(--jaune-clair-msc);
        border-top-left-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        height: 120px;

        img {
          width: 97px;
        }
      }

      .texte {
        color: #161616;
        font-size: 14px;
        font-weight: 700;
        line-height: normal;
        margin: 8px 8px 12px;
        text-align: center;
      }
    }
  }

  .dialogue-avis-utilisateur {
    min-width: 100%;
    max-height: 90vh;
    margin: auto 0 0;
    padding: 0;
    border: none;

    &::backdrop {
      background-color: rgba(0, 0, 0, 0.4);
    }

    @include a-partir-de(md) {
      height: min-content;
      max-width: 588px;
      min-width: 0;
      margin: auto;
      padding: 0 16px;
      border-radius: 8px;
    }

    .contenu {
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding: 16px 16px 0;
      gap: 16px;

      h4 {
        font-size: 1.375rem;
        font-weight: bold;
        line-height: 1.75rem;
        margin: 0;

        @include a-partir-de(md) {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }

      .mis-en-avant {
        font-weight: bold;
        margin: 8px 0 0;
      }

      .question {
        display: flex;
        flex-direction: column;
        gap: 8px;

        p {
          margin: 0;

          &.erreur {
            color: var(--text-default-error);
          }
        }

        .information {
          color: #666666;
          font-size: 0.75rem;
          line-height: 1.25rem;
          margin-top: 2px;
        }

        :global(textarea) {
          resize: vertical;
        }
      }
    }

    .actions {
      background-color: var(--background-default-grey);
      bottom: 0;
      position: sticky;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      border-top-color: transparent;

      @include a-partir-de(md) {
        flex-direction: row-reverse;
        padding: 48px 16px 32px;
      }

      animation: ajoute-bordure-100-pourcent linear;
      animation-timeline: scroll();
    }

    @keyframes ajoute-bordure-100-pourcent {
      0% {
        border-top-color: var(--border-default-grey);
      }
      99% {
        border-top-color: var(--border-default-grey);
      }
      100% {
        border-top-color: transparent;
      }
    }

    .satisfaction {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .niveaux-satisfaction {
        display: flex;
        flex-direction: row;

        input[type='radio'] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;

          + label > span {
            cursor: pointer;

            &:hover {
              background-color: var(--gris-secondaire-fond-hover);
            }

            &:active {
              background-color: var(--gris-secondaire-fond-clique);
            }
          }

          &:focus-visible + label {
            outline: 2px solid var(--bleu-contour-mis-en-valeur);
            outline-offset: 2px;
          }

          &:checked + label > span {
            background-color: var(--background-active-blue-france);
            &:hover {
              background-color: var(--jaune-msc-hover);
            }
            &:active {
              background-color: var(--jaune-msc-clique);
            }
          }
        }

        .niveau-satisfaction {
          display: flex;
          flex: 1;
          border: 1px solid var(--border-default-grey);
          border-right: 0;
          border-radius: 0;

          &[for='pas-du-tout'] {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }

          &[for='tout-a-fait'] {
            border-right: 1px solid var(--border-default-grey);
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }

          span {
            flex: 1;
            font-size: 1.25rem;
            line-height: 1.5rem;
            margin: 0;
            padding: 8px 16px;
            text-align: center;
          }
        }
      }

      .descriptions {
        color: #666666;
        display: flex;
        flex-direction: row;
        font-size: 0.875rem;
        font-style: normal;
        justify-content: space-between;
        line-height: 1.5rem;
      }
    }
  }
</style>
