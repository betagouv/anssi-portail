<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import {
    couleursDeNiveau,
    type IdNiveau,
    niveauxMaturite,
  } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneau from './LegendeAnneau.svelte';
  import LegendeRadarSessionGroupe from './LegendeRadarSessionGroupe.svelte';
  import RadarSessionGroupe from './RadarSessionGroupe.svelte';
  import { type Serie, type SerieRadar } from './Serie';
  import type { ReponsesResultatTest } from './TestMaturite.donnees';
  import TuilesMaturiteSessionGroupe from './TuilesMaturiteSessionGroupe.svelte';

  type ResumeNiveau = {
    total: number;
    moyennes: ReponsesResultatTest;
  };
  type ResultatsSessionGroupe = {
    nombreParticipants: number;
    resume: Record<IdNiveau, ResumeNiveau>;
  };

  let serie: Serie;
  let resultatsSessionGroupe: ResultatsSessionGroupe;

  let seriesRadar: SerieRadar[];

  async function rechargeResultatsGroupe() {
    let codeSessionGroupe = new URLSearchParams(window.location.search).get(
      'code'
    );
    const reponse = await axios.get<ResultatsSessionGroupe>(
      `/api/sessions-groupe/${codeSessionGroupe}/resultats`
    );
    resultatsSessionGroupe = reponse.data;
    serie = niveauxMaturite.map((niveau) => ({
      libelle: niveau.label,
      valeur: resultatsSessionGroupe.resume[niveau.id].total,
    }));
    seriesRadar = niveauxMaturite.map((niveau) => ({
      id: niveau.id,
      valeurs: resultatsSessionGroupe.resume[niveau.id].moyennes,
      couleur: couleursDeNiveau[niveau.id],
    }));
  }

  onMount(async () => {
    await rechargeResultatsGroupe();
    setInterval(rechargeResultatsGroupe, 5000);
  });
</script>

{#if resultatsSessionGroupe && resultatsSessionGroupe.nombreParticipants > 0}
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
          <GraphiqueAnneau {serie} nomDeLaDonnee="Participants" />
          <LegendeAnneau {serie} />
        {:else}
          <div>Pas de résultat, rechargez la page</div>
        {/if}
      </div>
    </div>
  </section>

  <section>
    <div class="contenu-section repartition-reponses">
      <h2>Répartition des réponses</h2>
      <RadarSessionGroupe series={seriesRadar} />
      <LegendeRadarSessionGroupe />
      <div class="message-information">
        Le résultat obtenu est une évaluation indicative basée sur un modèle
        élaboré par l’ANSSI. La maturité cyber n’est pas une évaluation du
        niveau de sécurité des systèmes d’information d’une organisation mais de
        sa posture à l’égard des enjeux cyber.
      </div>
    </div>
  </section>
{:else}
  <section>
    <div class="contenu-section contenu-sans-resultat">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Pas encore de résultat soumis par les participants"
      />
      <h4>Encouragez vos participants à finaliser le test</h4>
      <p>
        Les résultats seront disponibles dès que les participants auront
        complété le test.<br /> Invitez-les à le finaliser.
      </p>
    </div>
  </section>
{/if}

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

  .repartition-reponses {
    h2 {
      margin-bottom: 32px;
    }
  }

  .message-information {
    font-size: 0.75rem;
    line-height: 1.5rem;
    font-style: italic;
    padding: 24px 0;
    color: #666666;
  }

  .contenu-section {
    &.contenu-sans-resultat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin: 32px auto 72px;
      border-bottom: none;

      h4 {
        font-size: 1.5rem;
        line-height: 2rem;
        text-align: center;
        margin: 0;
      }

      p {
        text-align: center;
        margin: 0;
      }
    }
  }
</style>
