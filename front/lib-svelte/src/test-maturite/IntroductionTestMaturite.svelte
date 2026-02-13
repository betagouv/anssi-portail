<script lang="ts">
  import axios from 'axios';
  import { derived } from 'svelte/store';
  import { profilStore } from '../stores/profil.store';

  export let introFaite = false;

  const aDejaUnTest = derived<typeof profilStore, boolean>(
    profilStore,
    ($profilStore, set) => {
      if ($profilStore) {
        axios
          .get('/api/resultats-test/dernier')
          .then(() => set(true))
          .catch(() => set(false));
      }
    },
    false
  );

  function debuteTeste() {
    introFaite = true;
  }
</script>

{#if $aDejaUnTest}
  <lab-anssi-lien
    href="/ma-maturite"
    titre="Retour"
    icone="arrow-go-back-line"
    positionIcone="gauche"
  ></lab-anssi-lien>
{/if}
<div class="contenu-test">
  <div class="introduction">
    <h2>Quelle est la maturité cyber de votre organisation&nbsp;?</h2>
    <p>
      La maturité cyber reflète le niveau global de <b
        >prise en compte des enjeux de cybersécurité</b
      >
      par une organisation. Répondez à <b>6 questions</b> pour obtenir votre
      évaluation <b>indicative</b>.
    </p>
    <input
      type="button"
      class="bouton primaire taille-moyenne"
      value="Débuter le test"
      on:click={debuteTeste}
    />
    <hr />
    <div class="acces-session-groupe">
      <hgroup>
        <h6>
          <lab-anssi-icone taille="md" nom="team-fill"></lab-anssi-icone> Session
          de groupe
        </h6>
        <p class="texte-standard-md">
          Évaluez de façon indicative la maturité cyber du groupe en comparant
          anonymement les résultats des participants.
        </p>
      </hgroup>
      <dsfr-button
        label="Créer ou rejoindre une session"
        markup="a"
        href="/session-groupe"
        kind="secondary"
      ></dsfr-button>
    </div>
  </div>
  <div class="illustration">
    <img
      src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
      alt=""
    />
  </div>
</div>
<div class="note">
  Le résultat obtenu est une évaluation indicative basée sur un modèle élaboré
  par l’ANSSI. La maturité cyber n’est pas une évaluation du niveau de sécurité
  des systèmes d’information d’une organisation mais de sa posture à l’égard des
  enjeux cyber.
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .introduction {
    h2 {
      font-size: 1.75rem;
      line-height: 2.25rem;
      font-weight: bold;
      margin: 0 0 24px;

      @include a-partir-de(lg) {
        margin-top: 24px;
      }
      @include a-partir-de(xl) {
        margin-top: 0;
      }
    }

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
      margin-bottom: 24px;
    }

    .bouton {
      margin: 24px 0 16px;
    }
  }

  hr {
    margin: 40px 0 32px;
    height: 1px;
    border: 0;
    background-color: var(--border-default-grey);
  }

  .acces-session-groupe {
    hgroup {
      h6 {
        margin-bottom: 8px;
        lab-anssi-icone {
          margin-right: 8px;
        }
      }

      p {
        color: var(--text-default-grey);
      }
    }

    dsfr-button {
      margin-bottom: 24px;
    }
  }
</style>
