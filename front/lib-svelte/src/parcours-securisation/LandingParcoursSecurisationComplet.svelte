<script lang="ts">
  import HeroLandingPage from '../ui/HeroLandingPage.svelte';
  import BlocContenuLanding from '../ui/BlocContenuLanding.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';
  import IllustrationHerosParcoursComplet from './animation/IllustrationHerosParcoursComplet.svelte';

  type Contenu = {
    titre: string;
    description: string;
    ilustration: {
      src: string;
      alt: string;
    };
  };

  const contenus: Contenu[] = [
    {
      titre: 'Un programme complet',
      description:
        '6 modules pour protéger votre organisation des risques les plus courants — 6 mesures additionnelles sur la protection des données personnelles, établies avec la CNIL.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-complet-modules.svg',
        alt: 'Aperçu des 6 modules du parcours de sécurisation complet',
      },
    },
    {
      titre: 'Basé sur ReCyF',
      description:
        "Chaque mesure est issue du référentiel cyber français (ReCyF), simplifiée et accompagnée d'explications pédagogiques pour faciliter votre démarche mise en conformité NIS 2.",
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-complet-controler.svg',
        alt: 'Carte illustrant une mesure basée sur le référentiel ReCyF',
      },
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-complet-pourquoi.svg',
        alt: 'Vidéo pédagogique : pourquoi activer la vérification en deux étapes',
      },
    },
    {
      titre: 'Suivez votre progression',
      description:
        'Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-complet-progression.svg',
        alt: 'Carte de suivi de progression avec barre de complétion',
      },
    },
  ];
</script>

<div class="section-hero-et-tuiles">
  <HeroLandingPage
    description="Accédez à 6 modules élaborés pour protéger votre organisation contre les risques cyber les plus courants et faciliter votre démarche de mise en conformité NIS&nbsp;2 si vous êtes concerné."
    propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
    tag="+6000 organisations déjà accompagnées 🚀"
    class="hero-landing-page"
  >
    {#snippet titreHtml()}
      Engagez votre organisation dans une <MotEnExergue motif="vague" couleur="cafe-creme">démarche</MotEnExergue>
      <MotEnExergue motif="vague" couleur="cafe-creme" petit>cyber</MotEnExergue> complète
    {/snippet}
    {#snippet actions()}
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        href="/parcours-complet"
        markup="a"
      ></dsfr-button>
    {/snippet}
    {#snippet illustration()}
      <figure class="illustration">
        <IllustrationHerosParcoursComplet />
      </figure>
    {/snippet}
  </HeroLandingPage>

  <div class="section-tuiles">
    <dsfr-container class="conteneur-tuiles">
      <lab-anssi-carrousel-tuiles>
        <dsfr-tile title="Gratuit" action-markup="false" no-link size="sm"></dsfr-tile>
        <dsfr-tile title="Conçu par l'agence cyber de l'État" action-markup="false" no-link size="sm"></dsfr-tile>
        <dsfr-tile title="100% en ligne" action-markup="false" no-link size="sm"></dsfr-tile>
      </lab-anssi-carrousel-tuiles>
    </dsfr-container>
  </div>
</div>

<section class="section-contenu">
  <dsfr-container>
    <div class="blocs-contenu">
      {#each contenus as contenu, index (contenu.titre)}
        <BlocContenuLanding
          titre={contenu.titre}
          description={contenu.description}
          alignement={index % 2 === 0 ? 'texte-gauche' : 'texte-droite'}
          image={contenu.ilustration}
        />
      {/each}
    </div>

    <div class="cta-central">
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        href="/parcours-complet"
        markup="a"
      ></dsfr-button>
    </div>
  </dsfr-container>
</section>

<style lang="scss">
  .section-hero-et-tuiles {
    word-break: break-word;
  }
  .section-tuiles {
    lab-anssi-carrousel-tuiles {
      margin-block-start: -2.5rem;
    }
  }

  .section-contenu {
    padding-block: 6rem;

    .blocs-contenu {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
      margin-block-end: 3.5rem;
    }

    .cta-central {
      text-align: center;
    }
  }

  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
