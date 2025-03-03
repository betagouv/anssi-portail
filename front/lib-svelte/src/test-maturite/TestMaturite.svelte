<script lang="ts">
  import { questions } from "./TestMaturite.donnees";
  import { questionnaireStore } from "./stores/questionnaire.store";
  import Hero from "../Hero.svelte";
  import Etapier from "../Etapier.svelte";
  import ResultatsTestMaturite from "./ResultatsTestMaturite.svelte";
  import SelectSecteurActivite from "./SelectSecteurActivite.svelte";
  import SelectRegion from "./SelectRegion.svelte";

  let afficheResultats = false;
  let introFaite = false;

  questionnaireStore.initialise();

  function reponds() {
    questionnaireStore.reponds(reponseDonnee);
  }

  $: idQuestionCourante = questions[$questionnaireStore.questionCourante].id;

  function obtiensResultat() {
    afficheResultats = true;
  }

  function debuteTeste() {
    introFaite = true;
  }

  $: reponseDonnee =
    $questionnaireStore.toutesLesReponses[$questionnaireStore.questionCourante];

  function doitMontrerPropositions() {
    const avecPropositions = questions.filter((q) => q.propositions.length > 0);
    return $questionnaireStore.questionCourante < avecPropositions.length;
  }
</script>

{#if afficheResultats}
  <ResultatsTestMaturite />
{:else}
  <Hero
    titre="Test de maturité cyber"
    description="Obtenez en 5 minutes une évaluation indicative de la maturité cyber de votre organisation."
  />
  <section class="test-maturite">
    <div class="contenu-section">
      {#if introFaite}
        <div class="formulaire">
          <p class="etape">
            Étape {$questionnaireStore.questionCourante + 1} sur 7
          </p>
          <h5>{questions[$questionnaireStore.questionCourante].titre}</h5>
          <Etapier
            etapeCourante={$questionnaireStore.questionCourante}
            nombreEtapes={7}
          />
          <h2>
            {@html questions[$questionnaireStore.questionCourante].question}
          </h2>

          {#if doitMontrerPropositions()}
            <div class="propositions">
              {#each questions[$questionnaireStore.questionCourante].propositions as proposition, index}
                <label>
                  <input
                    type="radio"
                    bind:group={reponseDonnee}
                    value={index}
                  />
                  <span>{proposition}</span>
                </label>
              {/each}
            </div>

            <div class="commandes">
              <a href="/" class="lien">Retour à l'accueil</a>
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
                value={"Question suivante"}
                disabled={reponseDonnee === null}
                on:click={reponds}
              />
            </div>
          {:else}
            <div class="informations-complementaires">
              <label>
                Quel est le secteur d’activité de votre organisation&nbsp;?
                <SelectSecteurActivite />
              </label>

              <label>
                Dans quelle région se trouve votre organisation&nbsp;?
                <SelectRegion />
              </label>

              <fieldset class="choix-taille">
                <legend
                  >Quelle est la taille de votre organisation&nbsp;?
                </legend>
                <label><input type="radio" name="taille" />1 à 49</label>
                <label><input type="radio" name="taille" />50 à 249</label>
                <label><input type="radio" name="taille" />≥ 250</label>
              </fieldset>

              <div class="commandes">
                <a href="/" class="lien">Retour à l'accueil</a>
                <input
                  type="button"
                  class="bouton secondaire taille-moyenne"
                  value="Précédent"
                  on:click={questionnaireStore.reviensEnArriere}
                />
                <input
                  type="button"
                  class="bouton primaire taille-moyenne"
                  value="Obtenir mon résultat"
                  on:click={obtiensResultat}
                />
              </div>
            </div>
          {/if}
        </div>
        <div class="illustration">
          <img
            src="/assets/images/test-maturite/illustration-{idQuestionCourante}.svg"
            alt=""
          />
        </div>
      {:else}
        <div class="introduction">
          <h2>Quelle est la maturité cyber de votre organisation ?</h2>
          <p>
            La maturité cyber est une évaluation indicative du niveau global de
            prise en compte des enjeux de cyber sécurité par une organisation.
            Répondez à <b>6 questions</b> pour obtenir votre évaluation.
          </p>
          <input
            type="button"
            class="bouton primaire taille-moyenne"
            value="Débuter le test"
            on:click={debuteTeste}
          />
          <div class="note">
            Le résultat obtenu est une évaluation indicative basée sur un modèle
            élaboré par l’ANSSI. La maturité cyber n’est pas une évaluation du
            niveau de sécurité des systèmes d’information d’une organisation
            mais de sa posture à l’égard des enjeux cyber.
          </div>
        </div>
        <div class="illustration">
          <img
            src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
            alt=""
          />
        </div>
      {/if}
    </div>
  </section>
{/if}
