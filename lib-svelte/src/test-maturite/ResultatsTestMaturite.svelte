<script lang="ts">
  import Hero from "../Hero.svelte";
  import TuilesMaturite from "./TuilesMaturite.svelte";
  import { type IdNiveau, niveauxMaturite } from "./TestMaturite.donnees";
  import { questionnaireStore } from "./stores/questionnaire.store";
  import PubliciteMesServicesCyber from "./PubliciteMesServicesCyber.svelte";
  import RadarMaturite from "./RadarMaturite.svelte";
  import TuileVersParcours from "./TuileVersParcours.svelte";

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

  $: niveau =
    niveauxMaturite.find((niveau) => niveau.id === idNiveau) ||
    niveauxMaturite[0];
</script>

<Hero
  titre="Résultat de maturité cyber"
  description="Ce résultat nous permet de vous guider et de vous fournir les informations et les outils essentiels pour agir et améliorer votre niveau de maturité cyber."
/>
<div class="resultats-test">
  <div class="contenu-section">
    <h2>Niveau de maturité le plus proche : {niveau.label}</h2>
    <TuilesMaturite niveauCourant={niveau} />
    <div class="description-niveau">
      <h5>{niveau.label}</h5>
      <p>{niveau.description}</p>
    </div>

    <a href="#" target="_blank">Les niveaux de maturité cyber</a>
  </div>
</div>

<section class="pour-aller-plus-loin">
  <div class="contenu-section">
    <PubliciteMesServicesCyber />
  </div>
</section>

<section class="repartition">
  <div class="contenu-section">
    <h2>Répartition de votre maturité cyber</h2>
    <RadarMaturite {resultats} />
    <div class="note">
      Ce résultat est une évaluation indicative basé sur un modèle élaboré par
      l’ANSSI.
    </div>
  </div>
</section>

<section class="votre-parcours">
  <div class="contenu-section">
    {#if niveau.id === "intermediaire"}
      <TuileVersParcours parcours="approfondir"/>
    {:else if niveau.id === "optimal" || niveau.id === "confirme"}
      <div class="tuile">
        <img src="/assets/images/debuter-cyber.png" alt="">
        <h3>Les services et ressources cyber</h3>
        <p>Trouvez les services et les ressources adaptées à vos besoins et votre niveau cyber.</p>
        <a href="/catalogue" class="bouton primaire">Découvrir</a>
      </div>
    {:else}
      <TuileVersParcours parcours="debuter"/>
    {/if}
  </div>
</section>

