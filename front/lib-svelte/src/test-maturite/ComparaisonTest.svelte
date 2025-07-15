<script lang="ts">
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneau from './LegendeAnneau.svelte';
  import PartageTest from './PartageTest.svelte';
  import RadarSessionGroupe from './RadarSessionGroupe.svelte';
  import type { Serie, SerieRadar } from './Serie';
  import ResumeRadarComparaison from './ResumeRadarComparaison.svelte';

  export let testRealise = false;

  let serie: Serie = [
    { libelle: 'insuffisant', valeur: 2 },
    { libelle: 'emergeant', valeur: 4 },
    { libelle: 'optimal', valeur: 3 },
    { libelle: 'intermédiaire', valeur: 1 },
  ];
  let seriesRadar: SerieRadar[] = [
    {
      id: 'confirme',
      couleur: '#456789',
      valeurs: {
        'adoption-solutions': 1,
        'prise-en-compte-risque': 1,
        'ressources-humaines': 1,
        budget: 1,
        pilotage: 1,
        posture: 1,
      },
    },
    {
      id: 'emergent',
      couleur: '#72722a',
      valeurs: {
        'adoption-solutions': 2.5,
        'prise-en-compte-risque': 1.8,
        'ressources-humaines': 3,
        budget: 4.2,
        pilotage: 1,
        posture: 1.2,
      },
    },
  ];
</script>

{#if testRealise}
  <section class="repartion-organisations">
    <div class="contenu-section">
      <h2>Répartition des organisations</h2>
      <div class="repartition-niveaux-maturite">
        <GraphiqueAnneau {serie} nomDeLaDonnee="organisations" />
        <LegendeAnneau {serie} />
      </div>
    </div>
  </section>

  <section class="repartition-reponses">
    <div class="contenu-section">
      <h2>Répartition des réponses</h2>
      <RadarSessionGroupe series={seriesRadar} />
      <ResumeRadarComparaison series={seriesRadar}/>
      <div class="message-information">
        Le résultat obtenu est une évaluation indicative basée sur un modèle
        élaboré par l’ANSSI. La maturité cyber n’est pas une évaluation du
        niveau de sécurité des systèmes d’information d’une organisation mais de
        sa posture à l’égard des enjeux cyber.
      </div>
    </div>
  </section>
{:else}
  <section class="pas-de-test">
    <div class="contenu-section">
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Bientôt disponible"
      />
      <h4>Vous souhaitez comparer la maturité cyber de votre organisation ?</h4>
      <p>Pour cela vous devez d’abord réaliser le test de maturité cyber.</p>
      <a href="/test-maturite" class="bouton primaire"> Débuter le test </a>
    </div>
  </section>
{/if}
<PartageTest />

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .repartion-organisations {
    padding: 32px var(--gouttiere) 48px;

    .contenu-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 48px;

      .repartition-niveaux-maturite {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        gap: 56px;
      }
    }
  }

  .repartition-reponses {
    padding: 48px var(--gouttiere);

    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 32px;

      h2 {
        margin-bottom: 32px;
      }

      @include a-partir-de(sm) {
        align-items: center;
        justify-content: space-around;
        flex-direction: row;
      }

      .message-information {
        margin-top: 16px;
        font-size: 0.75rem;
        line-height: 1.5rem;
        padding: 24px 0;
        color: #666666;
      }
    }
  }

  .pas-de-test {
    .contenu-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      text-align: center;
    }

    img {
      max-width: 282px;
    }

    h4 {
      font-size: 1.5rem;
      line-height: 1.75rem;
      max-width: 588px;
    }

    p {
      font-size: 1.125rem;
      line-height: 1.75rem;
      max-width: 588px;
    }
  }
</style>
