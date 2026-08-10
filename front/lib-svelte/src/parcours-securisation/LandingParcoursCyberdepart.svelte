<script lang="ts">
  import BlocContenuLanding from '../ui/BlocContenuLanding.svelte';
  import BlocDiagnostic from '../ui/BlocDiagnostic.svelte';
  import HeroLandingPage from '../ui/HeroLandingPage.svelte';

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
      titre: 'Rapides à mettre en place',
      description:
        '12 mesures accessibles, souvent réalisables en quelques minutes pour commencer à vous protéger des cyberattaques.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-basique-mots-de-passe.svg',
        alt: 'Carte illustrant une mesure rapide : évitez les mots de passe faciles à deviner',
      },
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-basique-pourquoi.svg',
        alt: 'Vidéo pédagogique : pourquoi activer la vérification en deux étapes',
      },
    },
    {
      titre: 'Pratico-pratique',
      description: 'Des tutos et des outils pour vous aider à faire, concrètement.',
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-basique-comment.svg',
        alt: 'Tutoriel pas à pas : comment activer la vérification en deux étapes',
      },
    },
    {
      titre: 'Décrochez votre badge Cyberdépart',
      description:
        "Valorisez vos efforts et l'engagement de votre organisation dans une première démarche de sécurisation.",
      ilustration: {
        src: '/assets/images/parcours-securisation/illustration-parcours-basique-badge.svg',
        alt: 'Badge Cyberdépart obtenu après avoir complété les 13 mesures',
      },
    },
  ];
</script>

<div class="section-hero-et-tuiles">
  <HeroLandingPage
    titre="Votre cybersécurité décolle en 12&nbsp;mesures"
    description="12 mesures pensées pour les non-spécialistes, applicables en quelques minutes pour commencer à renforcer votre cybersécurité et prendre votre Cyberdépart&nbsp;!"
    propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
    tag="+6000 organisations déjà accompagnées 🚀"
    srcImage="/assets/images/parcours-securisation/illustration-hero-parcours-cyberdepart.png"
    imageDeFond="/assets/images/parcours-securisation/fond-hero-landing-parcours-securisation.svg"
    class="hero-landing-page"
  >
    {#snippet actions()}
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        href="/inscription"
        markup="a"
      ></dsfr-button>
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
        >
          {#snippet illustration()}
            <img src={contenu.ilustration.src} alt={contenu.ilustration.alt} />
          {/snippet}
        </BlocContenuLanding>
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
        href="/inscription"
        markup="a"
      ></dsfr-button>
    </div>
  </dsfr-container>
</section>

<section class="section-diagnostic">
  <dsfr-container>
    <BlocDiagnostic
      titre="Vous préférez échanger avec un Aidant cyber ?"
      description="Le diagnostic Cyberdépart vous permet de bénéficier d'un accompagnement gratuit d'1 heure avec un Aidant cyber bénévole. Retrouvez ensuite votre plan d'action sur MesServicesCyber."
      labelBouton="Demander un accompagnement gratuit"
      lienBouton="/inscription"
    >
      {#snippet illustration()}
        <img src="/assets/images/parcours-securisation/illustration-diagnostic.png" alt="" />
      {/snippet}
    </BlocDiagnostic>
  </dsfr-container>
</section>

<style lang="scss">
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

  .section-diagnostic {
    background-color: var(--background-alt-brown-cafe-creme);
    padding-block: 3.5rem;
  }
</style>
