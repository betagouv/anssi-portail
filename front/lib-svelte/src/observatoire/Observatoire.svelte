<script lang="ts">
  import CarteDonnees from '../graphiques/CarteDonnees.svelte';
  import '../graphiques/dsfrChart';
  import GraphiqueLineaire from '../graphiques/GraphiqueLineaire.svelte';

  // Données fictives, en dur le temps du POC.
  const source = 'MonServiceSécurisé';
  const date = '30/09/2026';
  const évolutionDesSystèmesSécurisés = [
    { mois: 'oct. 25', total: 14250 },
    { mois: 'nov. 25', total: 14900 },
    { mois: 'déc. 25', total: 15550 },
    { mois: 'janv. 26', total: 16210 },
    { mois: 'févr. 26', total: 16860 },
    { mois: 'mars 26', total: 17510 },
    { mois: 'avr. 26', total: 18160 },
    { mois: 'mai 26', total: 18810 },
    { mois: 'juin 26', total: 19460 },
    { mois: 'juil. 26', total: 20110 },
    { mois: 'août 26', total: 20780 },
    { mois: 'sept. 26', total: 21440 },
  ];
  const systèmesSécurisés = évolutionDesSystèmesSécurisés.at(-1)!.total;
</script>

<header class="bandeau">
  <dsfr-container>
    <h1>Observatoire de la cybersécurité des organisations</h1>
    <p class="chapo">La menace, la maturité et l’engagement des organisations françaises dans leur sécurisation.</p>
    <p class="mention">
      Les données sont issues des usages de MesServicesCyber, de MonServiceSécurisé et du Panorama de la menace 2025.
    </p>
  </dsfr-container>
</header>

<div class="contenu">
  <dsfr-container>
    <section>
      <h2>Projets</h2>
      <p class="introduction">La sécurisation et l’homologation des systèmes d’information dans le secteur public.</p>

      <div class="rangee">
        <CarteDonnees
          id="systemes-securises"
          titre="Systèmes d’information sécurisés"
          infobulle="Nombre de systèmes d’information déclarés dans MonServiceSécurisé."
          {source}
          {date}
        >
          <p class="chiffre-cle">{systèmesSécurisés.toLocaleString('fr-FR')}</p>
        </CarteDonnees>
        <CarteDonnees
          id="evolution-systemes-securises"
          titre="Évolution par mois (cumul)"
          infobulle="Évolution du nombre de systèmes d’information déclarés dans MonServiceSécurisé."
          {source}
          {date}
        >
          <GraphiqueLineaire
            x={évolutionDesSystèmesSécurisés.map((point) => point.mois)}
            y={évolutionDesSystèmesSécurisés.map((point) => point.total)}
            nom="SI sécurisés"
            unite="SI sécurisés"
          />
        </CarteDonnees>
      </div>
    </section>
  </dsfr-container>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  p {
    margin: 0;
  }

  .bandeau {
    padding: 3rem 0 2.5rem;
    border-bottom: 1px solid var(--border-default-grey);

    h1 {
      color: var(--text-title-grey);
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.75rem;

      @include a-partir-de(md) {
        font-size: 2.5rem;
        line-height: 3rem;
      }
    }

    .chapo {
      color: var(--text-default-grey);
      font-size: 1.25rem;
      line-height: 2rem;
      margin-bottom: 0.75rem;
    }

    .mention {
      color: var(--text-default-grey);
      font-size: 0.875rem;
      line-height: 1.5rem;
    }
  }

  .contenu {
    padding: 2rem 0 5rem;
    background: var(--background-alt-grey);

    h2 {
      color: var(--text-title-grey);
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.75rem;
    }

    .introduction {
      color: var(--text-mention-grey);
      max-width: 736px;
    }

    .rangee {
      display: grid;
      gap: 1.5rem;
      margin-top: 1.5rem;

      @include a-partir-de(md) {
        grid-template-columns: 1fr 2fr;
      }
    }

    .chiffre-cle {
      color: var(--text-title-grey);
      font-size: 2.5rem;
      line-height: 3rem;
      font-weight: bold;
      text-align: center;
      padding: 1rem 0;
    }
  }
</style>
