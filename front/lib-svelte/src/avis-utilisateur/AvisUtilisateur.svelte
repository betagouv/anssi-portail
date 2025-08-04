<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BoutonFermerModale from '../ui/BoutonFermerModale.svelte';
  import ChampTexte from '../ui/ChampTexte.svelte';
  import Formulaire from '../ui/Formulaire.svelte';
  import ZoneTexte from '../ui/ZoneTexte.svelte';

  export let featureFlagAvisUtilisateur: boolean = false;

  let encartOuvert = false;
  let dialogue: HTMLDialogElement;
  let afficheDialogue: boolean = false;

  let commentaire: string | undefined;
  let emailDeContact: string | undefined;

  const surCliqueCTA = () => {
    encartOuvert = false;
    afficheDialogue = true;
  };
  onMount(() => {
    encartOuvert = true;
  });
  $: {
    if (dialogue) {
      if (afficheDialogue) {
        dialogue.showModal();
      } else {
        dialogue.close();
      }
    }
  }
</script>

{#if featureFlagAvisUtilisateur && encartOuvert}
  <div
    class="avis-utilisateur-cta"
    transition:fly={{ duration: 500, x: 140, opacity: 1 }}
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
      on:click={() => (encartOuvert = false)}
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
    <Formulaire classe="formulaire-avis-utilisateur">
      <div class="contenu">
        <BoutonFermerModale on:click={() => dialogue.close()} />
        <h4>Votre avis nous intéresse&nbsp;!</h4>
        <div class="question">
          <p>Le service MesServicesCyber répond-il à vos attentes&nbsp;?</p>
          <div class="satisfaction">
            <div class="niveaux-satisfaction">
              <label class="niveau-satisfaction">
                <input type="radio" name="note" value="1" />
                <span aria-label="Pas du tout" role="img">😠</span>
              </label>
              <label class="niveau-satisfaction">
                <input type="radio" name="note" value="2" />
                <span aria-label="Pas satisfait" role="img">☹️</span>
              </label>
              <label class="niveau-satisfaction">
                <input type="radio" name="note" value="3" />
                <span aria-label="Moyennement satisfait" role="img">😕</span>
              </label>
              <label class="niveau-satisfaction">
                <input type="radio" name="note" value="4" />
                <span aria-label="Satisfait" role="img">😊</span>
              </label>
              <label class="niveau-satisfaction">
                <input type="radio" name="note" value="5" />
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
          <p>Que pouvons-nous améliorer ?</p>
          <ZoneTexte bind:valeur={commentaire} />
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
  </dialog>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .avis-utilisateur-cta {
    background-color: #ffffff;
    border-radius: 8px 0 0 8px;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 208px;
    width: 124px;
    z-index: 8;

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
        outline: 2px solid #0a76f6;
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
        outline: 2px solid #0a76f6;
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
      background-color: #ffffff;
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
        border-top-color: #ddd;
      }
      99% {
        border-top-color: #ddd;
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
        border: 1px solid var(--gris-clair);
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        overflow: hidden;

        input[type='radio'] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;

          + span {
            cursor: pointer;
          }

          &:checked + span {
            background-color: #000091;
          }
        }

        .niveau-satisfaction {
          display: flex;
          flex: 1;

          &:not(:last-child) {
            border-right: 1px solid var(--gris-clair);
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
