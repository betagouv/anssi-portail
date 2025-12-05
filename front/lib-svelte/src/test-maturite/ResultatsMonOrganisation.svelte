<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import EncartDeRecommandationSelonMaturite from './EncartDeRecommandationSelonMaturite.svelte';
  import PartageTest from './PartageTest.svelte';
  import { questionnaireStore } from './stores/questionnaire.store';
  import TuilesMaturite from './TuilesMaturite.svelte';

  export let animeTuiles = true;
  export let dateRealisation: Date | undefined = undefined;
  export let defilementAutomatique = true;

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
    <TuilesMaturite
      niveauCourant={niveau}
      {animeTuiles}
      {defilementAutomatique}
    />
    <div class="description-niveau">
      <h5>{niveau.label}</h5>
      <p>{niveau.description}</p>
    </div>

    <a href="/niveaux-maturite" class="lien" target="_blank"
      >Les niveaux de maturité cyber</a
    >
  </div>
</section>

<EncartDeRecommandationSelonMaturite {niveau} />

<section class="message-information">
  <div class="contenu-section">
    <p class="note">
      Ce résultat est une évaluation indicative basé sur un modèle élaboré par
      l’ANSSI. La maturité cyber n’est pas une évaluation du niveau de sécurité
      des systèmes d’information d’une organisation.
    </p>
  </div>
</section>

<PartageTest couleurFond="clair" />

<style lang="scss">
  .date-realisation {
    color: #3a3a3a;
    margin-bottom: 4px;
  }

  .message-information {
    padding-block: 0 56px;

    .note {
      color: #666666;
      font-size: 0.875rem;
      font-style: normal;
      line-height: 1.5rem;
      margin: 0;
    }
  }
</style>
