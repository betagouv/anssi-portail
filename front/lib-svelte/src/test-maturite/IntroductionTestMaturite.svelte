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
    <h2>Quelle est la maturité cyber de votre organisation ?</h2>
    <p>
      La maturité cyber <b>reflète</b> le niveau global de prise en compte des
      enjeux de cybersécurité par une organisation. Répondez à
      <b>6 questions</b>
      pour obtenir votre évaluation <b>indicative</b>.
    </p>
    <input
      type="button"
      class="bouton primaire taille-moyenne"
      value="Débuter le test"
      on:click={debuteTeste}
    />
    <div class="acces-session-groupe">
      <p>
        Vous souhaitez réaliser ce test à plusieurs, lors d’un atelier ou d’un
        événement ? Lancez une session de groupe pour recueillir et comparer les
        résultats des participants.
      </p>
      <a href="/session-groupe" class="lien"
        >Accéder à l’espace de session de groupe</a
      >
    </div>
    <div class="note">
      Le résultat obtenu est une évaluation indicative basée sur un modèle
      élaboré par l’ANSSI. La maturité cyber n’est pas une évaluation du niveau
      de sécurité des systèmes d’information d’une organisation mais de sa
      posture à l’égard des enjeux cyber.
    </div>
  </div>
  <div class="illustration">
    <img
      src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
      alt=""
    />
  </div>
</div>

<style lang="scss">
  .acces-session-groupe {
    p {
      font-weight: bold;
      margin-bottom: 8px;
    }
  }
</style>
