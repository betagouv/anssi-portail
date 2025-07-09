<script lang="ts">
  import Tuile from './Tuile.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import GraphiqueAnneau from '../test-maturite/GraphiqueAnneau.svelte';
  import type { Serie } from '../test-maturite/Serie';
  import LegendeAnneau from '../test-maturite/LegendeAnneau.svelte';

  type Statistiques = {
    utilisateursInscrits: number;
    testsMaturite: {
      total: number;
      parNiveau: {
        insuffisant: number;
        emergent: number;
        intermediaire: number;
        confirme: number;
        optimal: number;
      };
    };
    diagnosticsCyber: number;
    servicesEtRessourcesConsultes: number;
  };

  let mesures: Statistiques | undefined = undefined;
  let serie: Serie = [];

  onMount(async () => {
    const reponse = await axios.get<Statistiques>('/api/statistiques');
    mesures = reponse.data;
    Object.entries(mesures.testsMaturite.parNiveau);
    for (const [libelle, valeur] of Object.entries(
      mesures.testsMaturite.parNiveau
    )) {
      serie.push({ libelle, valeur });
    }
  });
</script>

{#if mesures}
  <div class="tuiles">
    <Tuile
      description="Utilisateurs inscrits"
      image="stat-utilisateurs-inscrits"
      mesure={mesures.utilisateursInscrits}
    />
    <Tuile
      description="Test de maturité cyber"
      image="stat-test-maturite"
      mesure={mesures.testsMaturite.total}
    />
    <Tuile
      description="Diagnostics cyber"
      image="stat-diagnostics-cyber"
      mesure={mesures.diagnosticsCyber}
    />
    <Tuile
      description="Services et ressources consultés"
      image="stat-services-et-ressources-consultes"
      mesure={mesures.servicesEtRessourcesConsultes}
    />
  </div>
  <div class="repartition">
    <h2>Répartition de la maturité cyber</h2>
    <span class="description"
      >Répartition de la maturité cyber des organisations sur l’ensemble des
      tests réalisés.</span
    >
    <div class="donnees-graphiques">
      <GraphiqueAnneau {serie} nomDeLaDonnee="tests réalisés" />
      <LegendeAnneau {serie} />
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .tuiles {
    display: grid;
    gap: 24px;
    @include a-partir-de(sm) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .repartition {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    padding: 24px 24px 72px;
    border: 1px solid #ddd;
    border-radius: 8px;

    h2 {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: bold;
      margin: 0;
    }

    .description {
      color: #3a3a3a;
      margin-bottom: 72px;
    }

    .donnees-graphiques {
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
  }
</style>
