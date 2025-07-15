<script lang="ts">
  import BoutonsPartageTest from './BoutonsPartageTest.svelte';
  import GraphiqueAnneau from './GraphiqueAnneau.svelte';
  import LegendeAnneau from './LegendeAnneau.svelte';
  import LegendeRadarSessionGroupe from './LegendeRadarSessionGroupe.svelte';
  import PartageTest from './PartageTest.svelte';
  import RadarSessionGroupe from './RadarSessionGroupe.svelte';
  import type { Serie, SerieRadar } from './Serie';

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
  ];
</script>

<section class="comparaison">
  <div class="contenu-section">
    {#if testRealise}
      <section>
        <div class="contenu-section">
          <h2>Répartition des niveaux de maturité cyber de cette session</h2>
          <div class="repartition-niveaux-maturite">
            <GraphiqueAnneau {serie} nomDeLaDonnee="Participants" />
            <LegendeAnneau {serie} />
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
            niveau de sécurité des systèmes d’information d’une organisation
            mais de sa posture à l’égard des enjeux cyber.
          </div>
        </div>
      </section>
    {:else}
      <img
        src="/assets/images/illustration-dragon-aucun-resultat.svg"
        alt="Bientôt disponible"
      />
      <h4>Vous souhaitez comparer la maturité cyber de votre organisation ?</h4>
      <p>Pour cela vous devez d’abord réaliser le test de maturité cyber.</p>
      <a href="/test-maturite" class="bouton primaire"> Débuter le test </a>
    {/if}
  </div>
</section>
<PartageTest />

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .description-test-realise {
    margin-bottom: 16px;
  }

  .repartition-niveaux-maturite {
    display: flex;
    flex-direction: column;
    align-self: center;
    gap: 48px;
    @include a-partir-de(sm) {
      align-items: center;
      justify-content: space-around;
      flex-direction: row;
    }
  }

  .message-information {
    font-size: 0.75rem;
    line-height: 1.5rem;
    padding: 24px 0;
    color: #666666;
  }
</style>
