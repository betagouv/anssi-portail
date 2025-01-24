<script lang="ts">
  import { questions } from "./TestMaturite.donnees";
  import { questionnaireStore } from "./stores/questionnaire.store";
  import Hero from "../Hero.svelte";
  import Etapier from "../Etapier.svelte";
  import ResultatsTestMaturite from "./ResultatsTestMaturite.svelte";

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
    description="Déterminez quel est le niveau de maturité cyber de votre organisation en 5 minutes."
  />
  <div class="test-maturite">
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
          <h4>
            {@html questions[$questionnaireStore.questionCourante].question}
          </h4>

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
                value={"Question suivante"}
                disabled={reponseDonnee === null}
                on:click={reponds}
              />
            </div>
          {:else}
            <div class="informations-complementaires">
              <div class="note">Ces informations sont facultatives et restent anonymes</div>
            <p>
                MesServices a pour mission d'aider les organisations à améliorer
                leur niveau de sécurité cyber. En renseignant ces informations,
                vous contribuez à établir une cartographie nationale de la
                maturité cyber, qui permettra d'adapter les services et
                recommandations proposés.
              </p>

              <label>
                Quel est le secteur d’activité de votre organisation&nbsp;?
                <select>
                  <option disabled selected>Sélectionner une option</option>
                  <option>Banques (secteur bancaire)</option>
                  <option>Eau potable</option>
                  <option>Eaux usées</option>
                  <option>Énergie</option>
                  <option>Espace</option>
                  <option>Fabrication</option>
                  <option
                    >Fabrication, production et distribution de produits
                    chimiques
                  </option>
                  <option>Fournisseurs numériques</option>
                  <option>Gestion des déchets</option>
                  <option>Gestion des services TIC</option>
                  <option>Infrastructure des marchés financiers</option>
                  <option>Infrastructure numérique</option>
                  <option
                    >Production transformation et distribution de denrées
                    alimentaires
                  </option>
                  <option>Recherche</option>
                  <option>Santé</option>
                  <option>Services postaux et d'expédition</option>
                  <option>Transports</option>
                  <option>Autre secteur d'activité</option>
                </select>
              </label>

              <label>
                Dans quelle région se trouve votre organisation&nbsp;?
                <select>
                  <option disabled selected>Sélectionner une option</option>
                  <option>Auvergne-Rhône-Alpes</option>
                  <option>Bourgogne-Franche-Comté</option>
                  <option>Bretagne</option>
                  <option>Centre-Val de Loire</option>
                  <option>Corse</option>
                  <option>Grand Est</option>
                  <option>Guadeloupe</option>
                  <option>Guyane</option>
                  <option>Hauts-de-France</option>
                  <option>Ile-de-France</option>
                  <option>Martinique</option>
                  <option>Mayotte</option>
                  <option>Nouvelle-Aquitaine</option>
                  <option>Normandie</option>
                  <option>Occitanie</option>
                  <option>Pays de la Loire</option>
                  <option>Provence-Alpes-Côte d'Azur</option>
                  <option>La Réunion</option>
                </select>
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
                <a href="/">Retour à l'accueil</a>
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
          />
        </div>
      {:else}
        <div class="introduction">
          <h4>Quelle est la maturité cyber de votre organisation ?</h4>
          <p>
            Ce test vous invite à répondre à <b>6 questions</b> permettant de déterminer
            votre niveau de maturité cyber.
          </p>
          <p>
            Le résultat nous permettra de vous guider et de vous fournir les
            informations et les outils essentiels pour agir et <b
              >améliorer le niveau de sécurité cyber de votre organisation.</b
            >
          </p>
          <input
            type="button"
            class="bouton primaire taille-moyenne"
            value="Débuter le test"
            on:click={debuteTeste}
          />
          <div class="note">Le résultat obtenu est une évaluation indicative basé sur un modèle élaboré par l’ANSSI.</div>
        </div>
        <div class="illustration">
          <img
            src="/assets/images/test-maturite/illustration-prise-en-compte-risque.svg"
          />
        </div>
      {/if}
    </div>
  </div>
{/if}
