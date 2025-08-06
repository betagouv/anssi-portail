<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import GraphiqueAnneau from '../test-maturite/GraphiqueAnneau.svelte';
  import LegendeAnneau from '../test-maturite/LegendeAnneau.svelte';
  import type { RepartitionResultatsTestPourUnNiveau } from '../test-maturite/ResultatsTest.type';
  import { construisSerie } from '../test-maturite/resultatTest';
  import SelectRegion from '../test-maturite/SelectRegion.svelte';
  import SelectSecteurActivite from '../test-maturite/SelectSecteurActivite.svelte';
  import SelectTailleOrganisation from '../test-maturite/SelectTailleOrganisation.svelte';
  import type { Serie } from '../test-maturite/Serie';
  import Tuile from './Tuile.svelte';

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
  let region: string | null = null;
  let secteur: string | null = null;
  let tailleOrganisation: string | null = null;

  $: filtreActif = !!secteur || !!tailleOrganisation || !!region;

  async function chargeRepartitionsDesResultats() {
    const parametres = new URLSearchParams({
      secteur: secteur ?? '',
      tailleOrganisation: tailleOrganisation ?? '',
      region: region ?? '',
    });
    const reponse = await axios.get<RepartitionResultatsTestPourUnNiveau[]>(
      '/api/repartition-resultats-test?' + parametres.toString()
    );
    if (reponse.status === 204) {
      serie = [];
      return;
    }

    const repartitions = reponse.data;

    serie = construisSerie({
      repartitions,
      mode: filtreActif ? 'ratio' : 'absolu',
    });
  }

  onMount(async () => {
    const reponse = await axios.get<Statistiques>('/api/statistiques');
    mesures = reponse.data;
    await chargeRepartitionsDesResultats();
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
      description="Tests de maturité cyber"
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
    <div>
      <h2>Répartition de la maturité cyber</h2>
      <span class="description"
        >Répartition de la maturité cyber des organisations sur l’ensemble des
        tests réalisés.</span
      >
    </div>
    <div class="filtres">
      <p>
        Affinez les résultats en appliquant des filtres par secteur, région ou
        taille d’organisation.
      </p>

      <div class="champs">
        <label class="champ-filtre">
          <span>Secteur d'activté</span>
          <SelectSecteurActivite bind:secteur />
        </label>

        <label class="champ-filtre">
          <span>Région</span>
          <SelectRegion bind:region />
        </label>

        <label class="champ-filtre">
          <span>Taille de l'organisation</span>
          <SelectTailleOrganisation bind:tailleOrganisation />
        </label>
      </div>
    </div>
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
    gap: 2rem;

    h2 {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: bold;
      margin: 0;
      @include a-partir-de(sm) {
        font-size: 1.75rem;
        line-height: 2.25rem;
      }
    }

    .description {
      color: #3a3a3a;
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

    .filtres {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .champs {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
        @include a-partir-de(sm) {
          grid-template-columns: repeat(2, 1fr);
        }
        @include a-partir-de(md) {
          grid-template-columns: repeat(3, 1fr);
        }

        .champ-filtre {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
      }

      p {
        color: #161616;
        font-size: 1.125rem;
        font-weight: bold;
        line-height: 1.75rem;
        margin: 0;
      }
    }
  }
</style>
