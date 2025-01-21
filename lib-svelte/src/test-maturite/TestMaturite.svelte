<script lang="ts">
  import { questions } from "./TestMaturite.donnees";
  import RadarMaturite from "./RadarMaturite.svelte";
  import { questionnaireStore } from "./stores/questionnaire.store";

  questionnaireStore.initialise();

  function reponds() {
    questionnaireStore.reponds(reponseDonnee);
  }

  $: reponseDonnee =
    $questionnaireStore.toutesLesReponses[$questionnaireStore.questionCourante];
</script>

<div class="test-maturite">
  <h1>Testez votre maturité Cyber</h1>
  <RadarMaturite></RadarMaturite>
  <p>Étape {$questionnaireStore.questionCourante + 1} sur 7</p>
  <h5>{questions[$questionnaireStore.questionCourante].titre}</h5>
  <h4>{@html questions[$questionnaireStore.questionCourante].question}</h4>
  {#each questions[$questionnaireStore.questionCourante].propositions as proposition, index}
    <label>
      <input type="radio" bind:group={reponseDonnee} value={index} />
      {proposition}
    </label>
  {/each}

  <pre>
    {JSON.stringify($questionnaireStore)}
  </pre>

  <div class="commandes">
    <a href="/">Retour à l'accueil</a>
    <input
      type="button"
      class="bouton secondaire taille-moyenne"
      value="Précédent"
      disabled={$questionnaireStore.questionCourante === 0}
      on:click={questionnaireStore.reviensEnArriere}
    />
    <input
      type="button"
      class="bouton primaire taille-moyenne"
      value="Question suivante"
      disabled={reponseDonnee === null}
      on:click={reponds}
    />
  </div>
</div>
