<script lang="ts">
  import '../graphiques/dsfrChart';
  import GraphiqueCirculaire from '../graphiques/GraphiqueCirculaire.svelte';

  // Données fictives, en dur le temps du POC.
  const maturiteDesOrganisations = [
    { libelle: 'Insuffisant', valeur: 420 },
    { libelle: 'Émergent', valeur: 510 },
    { libelle: 'Intermédiaire', valeur: 330 },
    { libelle: 'Confirmé', valeur: 180 },
    { libelle: 'Optimal', valeur: 60 },
  ];
</script>

<header class="bandeau">
  <dsfr-container>
    <h1>Observatoire de la cybersécurité des organisations</h1>
    <p class="description">
      La menace, la maturité et l’engagement des organisations françaises dans leur sécurisation.
    </p>
    <p class="mention">
      Les données sont issues des usages de MesServicesCyber, de MonServiceSécurisé et du Panorama de la menace 2025.
    </p>
  </dsfr-container>
</header>

<dsfr-container>
  <div class="zone-graphique">
    <GraphiqueCirculaire
      x={maturiteDesOrganisations.map((element) => element.libelle)}
      y={maturiteDesOrganisations.map((element) => element.valeur)}
      unite="organisations"
    />
  </div>
</dsfr-container>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .bandeau {
    padding: 2rem 0;
    border-bottom: 1px solid var(--border-default-grey);
    color: var(--text-title-grey);

    @include a-partir-de(sm) {
      padding: 3rem 0;
    }

    h1 {
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 1rem;

      @include a-partir-de(sm) {
        font-size: 2.5rem;
        line-height: 3rem;
      }
    }

    p {
      margin: 0;
    }

    .description {
      font-size: 1.25rem;
      line-height: 2rem;
      margin-bottom: 1rem;
    }

    .mention {
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
  }

  .zone-graphique {
    width: 100%;
    max-width: 480px;
    margin: 2rem auto;
  }
</style>
