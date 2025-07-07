<script lang="ts">
  import Tuile from './Tuile.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

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
      }
    };
    diagnosticsCyber: number;
    servicesEtRessourcesConsultes: number;
  }

  let mesures: Statistiques | undefined = undefined;

  onMount(async () => {
    const reponse = await axios.get<Statistiques>('/api/statistiques');
    mesures = reponse.data;
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
</style>
