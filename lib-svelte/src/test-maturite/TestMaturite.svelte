<script lang="ts">
  import {
    type IdNiveau,
    niveauxMaturite,
    questions,
  } from "./TestMaturite.donnees";
  import RadarMaturite from "./RadarMaturite.svelte";
  import { questionnaireStore } from "./stores/questionnaire.store";

    let afficheResultats = false;

  questionnaireStore.initialise();

  function reponds() {
    questionnaireStore.reponds(reponseDonnee);
  }

  $: resultats = {
    pilotage: $questionnaireStore.toutesLesReponses[2] + 1,
    budget: $questionnaireStore.toutesLesReponses[4] + 1,
    "ressources-humaines": $questionnaireStore.toutesLesReponses[3] + 1,
    "adoption-solutions": $questionnaireStore.toutesLesReponses[5] + 1,
    "prise-en-compte-risque": $questionnaireStore.toutesLesReponses[0] + 1,
    posture: $questionnaireStore.toutesLesReponses[1] + 1,
  };

  const calculeIdNiveau = (moyenne: number): IdNiveau => {
    if (moyenne < 1) return "insuffisant";
    if (moyenne < 2) return "emergent";
    if (moyenne < 3) return "intermediaire";
    if (moyenne < 4) return "confirme";
    return "optimal";
  };

  $: moyenne =
    $questionnaireStore.toutesLesReponses.reduce(
      (acc, valeur) => acc + valeur,
      0,
    ) / $questionnaireStore.toutesLesReponses.length;

  $: idNiveau = calculeIdNiveau(moyenne);

  $: niveau = niveauxMaturite[idNiveau];

  function obtiensResultat() {
    afficheResultats = true;
  }

  $: reponseDonnee =
    $questionnaireStore.toutesLesReponses[$questionnaireStore.questionCourante];

  function doitMontrerPropositions() {
    const avecPropositions = questions.filter((q) => q.propositions.length > 0);
    return $questionnaireStore.questionCourante < avecPropositions.length;
  }
</script>

<div class="test-maturite">
  {#if afficheResultats}
    <h1>Résultat de maturité cyber</h1>
    <h2>Niveau de maturité le plus proche : {niveau.label}</h2>

    <RadarMaturite {resultats} />
  {:else}
    <h1>Testez votre maturité Cyber</h1>

    <p>Étape {$questionnaireStore.questionCourante + 1} sur 7</p>

    <h5>{questions[$questionnaireStore.questionCourante].titre}</h5>
    <h4>{@html questions[$questionnaireStore.questionCourante].question}</h4>

    {#if doitMontrerPropositions()}
      {#each questions[$questionnaireStore.questionCourante].propositions as proposition, index}
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
        <p>
          MesServices a pour mission d'aider les organisations à améliorer leur
          niveau de sécurité cyber. En renseignant ces informations, vous
          contribuez à établir une cartographie nationale de la maturité cyber,
          qui permettra d'adapter les services et recommandations proposés.
        </p>

        <label>
          Quel est le secteur d’activité de votre organisation&nbsp;?
          <select>
            <option></option>
            <option>Banques (secteur bancaire)</option>
            <option>Eau potable</option>
            <option>Eaux usées</option>
            <option>Énergie</option>
            <option>Espace</option>
            <option>Fabrication</option>
            <option
              >Fabrication, production et distribution de produits chimiques
            </option>
            <option>Fournisseurs numériques</option>
            <option>Gestion des déchets</option>
            <option>Gestion des services TIC</option>
            <option>Infrastructure des marchés financiers</option>
            <option>Infrastructure numérique</option>
            <option
              >Production transformation et distribution de denrées alimentaires
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
            <option></option>
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
          <legend>Quelle est la taille de votre organisation&nbsp;?</legend>
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
  {/if}
</div>
