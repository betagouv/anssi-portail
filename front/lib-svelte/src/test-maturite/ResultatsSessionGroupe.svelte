<script lang="ts">
  import axios from 'axios';
  import { type Serie, type SerieRadar } from './Serie';
  import { onMount } from 'svelte';
  import { type IdNiveau, niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdRubrique } from './TestMaturite.donnees';
  import RadarSessionGroupe from './RadarSessionGroupe.svelte';
  import TuilesMaturiteSessionGroupe from './TuilesMaturiteSessionGroupe.svelte';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneauSessionGroupe from './LegendeAnneauSessionGroupe.svelte';

  type ResumeNiveau = {
    total: number;
    moyennes: Record<IdRubrique, number>;
  };
  type ResultatsSessionGroupe = {
    nombreParticipants: number;
    resume: Record<IdNiveau, ResumeNiveau>;
  };

  let serie: Serie;
  let resultatsSessionGroupe: ResultatsSessionGroupe;

  let seriesRadar: SerieRadar[];

  const couleurs = {
    insuffisant: '#6369f1',
    emergent: '#fec54b',
    intermediaire: '#8248a1',
    confirme: '#f26c85',
    optimal: '#8ed4a3',
  };

  onMount(async () => {
    let codeSessionGroupe = new URLSearchParams(window.location.search).get(
      'code',
    );
    const reponse = await axios.get<ResultatsSessionGroupe>(
      `/api/sessions-groupe/${codeSessionGroupe}/resultats`,
    );
    resultatsSessionGroupe = reponse.data;
    serie = niveauxMaturite.map((niveau) => ({
      libelle: niveau.label,
      valeur: resultatsSessionGroupe.resume[niveau.id].total,
    }));
    seriesRadar = niveauxMaturite.map((niveau) => ({
      id: niveau.id,
      valeurs: resultatsSessionGroupe.resume[niveau.id].moyennes,
      couleur: couleurs[niveau.id],
    }));
  });
</script>

<section>
  <div class="contenu-section">
    <h2>Les 5 niveaux de maturité cyber</h2>
    <TuilesMaturiteSessionGroupe />
    <a href="/niveaux-maturite" class="lien" target="_blank">
      Les niveaux de maturité cyber
    </a>
  </div>
</section>

<section>
  <div class="contenu-section">
    <h2>Répartition des niveaux de maturité cyber de cette session</h2>
    <div class="repartition-niveaux-maturite">
      {#if resultatsSessionGroupe && resultatsSessionGroupe.nombreParticipants > 0}
        <GraphiqueAnneau {serie} />
        <LegendeAnneauSessionGroupe {serie} />
      {:else}
        <div>Pas de résultat, rechargez la page</div>
      {/if}
    </div>
  </div>
</section>

<section>
  <div class="contenu-section">
    <h2>Répartition des réponses</h2>
    <RadarSessionGroupe series={seriesRadar} />
  </div>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  section {
    padding: 48px var(--gouttiere) 0;

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding-bottom: 48px;
      border-bottom: 1px solid var(--gris-clair);
    }
  }

  h2 {
    margin: 0;
    font-size: 2rem;
    line-height: 2.5rem;
  }

  .repartition-niveaux-maturite {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 48px;
  }
</style>
