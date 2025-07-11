<script lang="ts">
  import {
    type IdNiveau,
    niveauxMaturite,
  } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import {
    questionnaireStore,
    resultatsQuestionnaire,
  } from './stores/questionnaire.store';
  import TuilesMaturite from './TuilesMaturite.svelte';
  import PubliciteMesServicesCyber from './PubliciteMesServicesCyber.svelte';
  import RadarMaturite from './RadarMaturite.svelte';
  import { questions } from './TestMaturite.donnees';
  import EncartDeRecommandationSelonMaturite from './EncartDeRecommandationSelonMaturite.svelte';
  import PartageTest from './PartageTest.svelte';

  export let affichePubMsc = true;
  export let afficheRappelReponses = false;
  export let animeTuiles = true;
  export let dateRealisation: Date | undefined = undefined;

  const calculeIdNiveau = (moyenne: number): IdNiveau => {
    if (moyenne < 1) return 'insuffisant';
    if (moyenne < 2) return 'emergent';
    if (moyenne < 3) return 'intermediaire';
    if (moyenne < 4) return 'confirme';
    return 'optimal';
  };

  $: moyenne =
    $questionnaireStore.toutesLesReponses.reduce(
      (acc, valeur) => acc + valeur,
      0
    ) / $questionnaireStore.toutesLesReponses.length;

  $: idNiveau = calculeIdNiveau(moyenne);

  const trouveNiveauMaturiteParId = (id: string) =>
    niveauxMaturite.find((niveau) => niveau.id === id) || niveauxMaturite[0];

  $: niveau = trouveNiveauMaturiteParId(idNiveau);

  $: dateFormatee = dateRealisation
    ? new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
      }).format(new Date(dateRealisation))
    : undefined;
</script>

<section class="resultats-test">
  <div class="contenu-section">
    {#if dateFormatee}
      <div class="date-realisation">Test réalisé le {dateFormatee}</div>
    {/if}
    <h2>Niveau de maturité le plus proche : {niveau.label}</h2>
    <TuilesMaturite niveauCourant={niveau} {animeTuiles} />
    <div class="description-niveau">
      <h5>{niveau.label}</h5>
      <p>{niveau.description}</p>
    </div>

    <a href="/niveaux-maturite" class="lien" target="_blank"
      >Les niveaux de maturité cyber</a
    >
  </div>
</section>

{#if affichePubMsc}
  <section class="pour-aller-plus-loin">
    <div class="contenu-section">
      <PubliciteMesServicesCyber />
    </div>
  </section>
{/if}

<section class="repartition">
  <div class="contenu-section">
    <h2>Répartition de votre maturité cyber</h2>
    <RadarMaturite resultats={$resultatsQuestionnaire} />
    <div class="note">
      Ce résultat est une évaluation indicative basé sur un modèle élaboré par
      l’ANSSI. La maturité cyber n’est pas une évaluation du niveau de sécurité
      des systèmes d’information d’une organisation.
    </div>
  </div>
</section>

{#if afficheRappelReponses}
  <section class="rappel-reponses">
    <div class="contenu-section">
      <h2>Rappel de vos réponses</h2>
      <div class="reponses">
        {#each questions as question (question.id)}
          <div class="reponse">
            <h3>{question.titre}</h3>
            <p>
              {question.propositions[
                ($resultatsQuestionnaire[question.id] || 1) - 1
              ]}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}

<EncartDeRecommandationSelonMaturite {niveau} />

<PartageTest couleurFond="fonce" />

<style lang="scss">
  .date-realisation {
    color: #3a3a3a;
    margin-bottom: 4px;
  }
</style>
