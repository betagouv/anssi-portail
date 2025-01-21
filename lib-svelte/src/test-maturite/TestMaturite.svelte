<script lang="ts">
  import { questions } from "./TestMaturite.donnees";
  import RadarMaturite from "./RadarMaturite.svelte";

  let questionCourante = 0;
  let reponseDonnee: number | null = null;

  let toutesReponses: (number | null)[] = Array(6);
  toutesReponses.fill(null);

  function reponds() {
    toutesReponses[questionCourante] = reponseDonnee;
    questionCourante++;
    reponseDonnee = toutesReponses[questionCourante];
  }

  function reviensEnArriere() {
    questionCourante--;
    reponseDonnee = toutesReponses[questionCourante];
  }
</script>

<div class="test-maturite">
  <h1>Testez votre maturité Cyber</h1>
  <RadarMaturite></RadarMaturite><p>Étape {questionCourante + 1} sur 7</p>
  <h5>{questions[questionCourante].titre}</h5>
  <h4>{@html questions[questionCourante].question}</h4>
  {#each questions[questionCourante].propositions as proposition, index}
    <label>
      <input type="radio" bind:group={reponseDonnee} value={index} />
      {proposition}
    </label>
  {/each}

  <div class="commandes">
    <a href="/">Retour à l'accueil</a>
    <input
      type="button"
      class="bouton secondaire taille-moyenne"
      value="Précédent"
      disabled={questionCourante === 0}
      on:click={reviensEnArriere}
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
