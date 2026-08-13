<script lang="ts">
  import BlocDiagnostic from '../ui/BlocDiagnostic.svelte';
  import HeroLandingPage from '../ui/HeroLandingPage.svelte';
  import Lien from '../ui/Lien.svelte';
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import IllustrationProtegerOrganisation from '../accueil/animation/proteger-organisation/IllustrationProtegerOrganisation.svelte';
  import Bouton from '../ui/Bouton.svelte';

  const tagsParcoursBasique = [
    {
      label: 'TPE / PME',
      accent: 'défaut',
      size: 'md',
      icon: 'store-2-fill',
    },
    {
      label: 'Collectivités',
      accent: 'défaut',
      size: 'md',
      icon: 'bank-fill',
    },
    {
      label: 'Associations',
      accent: 'défaut',
      size: 'md',
      icon: 'user-heart-fill',
    },
  ];

  const fonctionnalitesParcoursBasique = [
    {
      titre: 'Rapides à mettre en place',
      description: '13 mesures accessibles, souvent réalisables en quelques minutes.',
      illustration: '/assets/images/parcours-securisation/illustration-parcours-basique-mots-de-passe.svg',
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      illustration: '/assets/images/parcours-securisation/illustration-parcours-basique-pourquoi.svg',
    },
    {
      titre: 'Pratico-pratique',
      description: 'Des tutos et des outils pour vous aider à faire, concrètement.',
      illustration: '/assets/images/parcours-securisation/illustration-parcours-basique-comment.svg',
    },
    {
      titre: 'Décrochez votre badge Cyberdépart',
      description: "Un premier marqueur d'engagement pour votre sécurité.",
      badge: {
        label: 'À la clé',
        accent: 'green-bourgeon',
        size: 'sm',
        type: 'accent',
      },
      illustration: '/assets/images/parcours-securisation/illustration-parcours-basique-badge.svg',
    },
  ];

  const tagsParcoursComplet = [
    {
      label: 'PME / ETI',
      accent: 'défaut',
      size: 'md',
      icon: 'building-fill',
    },
    {
      label: 'Organisations concernées NIS 2',
      accent: 'défaut',
      size: 'md',
      icon: 'checkbox-circle-fill',
    },
  ];

  const fonctionnalitesParcoursComplet = [
    {
      titre: 'Un programme complet',
      description:
        'Protégez-vous contre les 5 risques cyber les plus courants — et 6 mesures additionnelles sur la protection des données personnelles, établies avec la CNIL.',
      illustration: '/assets/images/parcours-securisation/illustration-parcours-complet-modules.svg',
    },
    {
      titre: 'Basé sur ReCyf',
      description:
        "Chaque mesure est issue du référentiel ReCyf, simplifiée et accompagnée d'explications pédagogiques pour faciliter votre démarche de mise en conformité NIS 2.",
      illustration: '/assets/images/parcours-securisation/illustration-parcours-complet-controler.svg',
    },
    {
      titre: 'Suivez votre progression',
      description:
        'Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire.',
      illustration: '/assets/images/parcours-securisation/illustration-parcours-complet-progression.svg',
    },
  ];

  let enPause = $state(false);
  const libelléPause = $derived(enPause ? 'Lancer les animations' : 'Mettre les animations en pause');

  const basculePause = () => {
    enPause = !enPause;
  };
</script>

<div class="section-hero-et-tuiles">
  <HeroLandingPage
    description="Rejoignez notre programme d'accompagnement gratuit."
    propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
    tag="+6000 organisations déjà accompagnées 🚀"
    imageDeFond="/assets/images/parcours-securisation/fond-hero-landing-parcours-securisation.svg"
    class="hero-landing-page"
  >
    {#snippet titreHtml()}
      Je <span class="decorateur-titre"><span>protège</span></span> mon organisation contre les cyberattaques
    {/snippet}
    {#snippet actions()}
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        href="/modules/1"
        markup="a"
      ></dsfr-button>
    {/snippet}
    {#snippet illustration()}
      <figure class="illustration">
        <IllustrationProtegerOrganisation {enPause} />
        <div class="controle-animation">
          <Bouton
            type="secondaire"
            icone={enPause ? 'play-circle-line' : 'pause-circle-line'}
            iconeSeule
            libelle={libelléPause}
            titre={libelléPause}
            surClic={basculePause}
          />
        </div>
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

<section class="section-parcours-basique">
  <dsfr-container>
    <lab-anssi-fonctionnalites
      titre="La cybersécurité est étrangère à votre organisation ?"
      description="Accédez à 13 mesures simples pour protéger dès maintenant votre organisation contre les cyberattaques et prendre votre Cyberdépart ! 🚀"
      fonctionnalites={enPropriétéWebC(fonctionnalitesParcoursBasique)}
      cliquable
      avec-cta
      active-defilement
    >
      <dsfr-tags-group tags={tagsParcoursBasique} has-icon slot="hautentete"></dsfr-tags-group>
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        slot="cta"
        href="/modules/1"
        markup="a"
      ></dsfr-button>
    </lab-anssi-fonctionnalites>
  </dsfr-container>
</section>

<section class="section-diagnostic">
  <dsfr-container>
    <BlocDiagnostic
      titre="Vous préférez échanger avec un Aidant cyber ?"
      description="Le diagnostic cyberdépart vous permet de bénéficier d'un accompagnement gratuit d'1 heure avec un Aidant cyber
          bénévole. Retrouvez ensuite votre plan d'action sur MesServicesCyber."
      labelBouton="Demander un accompagnement gratuit"
      lienBouton="/cyberdepart?origine=landing-parcours-securisation"
    >
      {#snippet illustration()}
        <img
          class="illustration-diagnostic"
          src="/assets/images/parcours-securisation/illustration-diagnostic.png"
          alt=""
        />
      {/snippet}
    </BlocDiagnostic>
  </dsfr-container>
</section>

<section class="section-parcours-complet">
  <dsfr-container>
    <lab-anssi-fonctionnalites
      titre="Votre organisation agit déjà pour sa cybersécurité ?"
      description="Accédez à 57 mesures pour vous protéger contre les 5 risques cyber les plus courants."
      fonctionnalites={enPropriétéWebC(fonctionnalitesParcoursComplet)}
      orientation-media="gauche"
      cliquable
      avec-cta
      active-defilement
    >
      <dsfr-tags-group tags={tagsParcoursComplet} has-icon slot="hautentete"></dsfr-tags-group>
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        slot="cta"
        href="/parcours-complet"
        markup="a"
      ></dsfr-button>
    </lab-anssi-fonctionnalites>
  </dsfr-container>
</section>

<section class="section-pied-de-page">
  <dsfr-container>
    <p class="lien-test-maturite">
      <img class="icone-fleche" src="/assets/images/icone-fleche-droite-cercle-plein.svg" alt="" />
      <span>
        Trouvez le parcours adapté à votre organisation à l'aide de notre test de maturité cyber. <Lien
          href="/test-maturite"
          libelle="Débuter le test"
          neutre
        />
      </span>
    </p>

    <hr class="separateur" />
    <Lien href="/inscription" libelle="Haut de page" taille="md" icone="arrow-up-fill" />
  </dsfr-container>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .section-hero-et-tuiles {
    background-color: var(--pink-tuile-850-200);
  }

  :global(.decorateur-titre) {
    position: relative;

    :global(span) {
      position: relative;
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 120%;
      height: 100%;
      transform: translateX(-50%);
      background: url('/assets/images/parcours-securisation/hero-decor-titre.svg') no-repeat center / contain;
      pointer-events: none;
    }
  }

  .section-tuiles {
    .conteneur-tuiles {
      padding-block: 0;
    }

    lab-anssi-carrousel-tuiles {
      margin-block-start: -2.5rem;
    }
  }

  .section-parcours-basique {
    background-color: var(--pink-macaron-850-200);
    padding-block: 6rem;
  }

  .section-diagnostic {
    padding-block: 3.5rem;
  }

  .section-parcours-complet {
    background-color: var(--brown-cafe-creme-975-75);
    padding-block: 6rem;
  }

  .section-pied-de-page {
    padding-block: 3rem;
  }

  .lien-test-maturite {
    align-items: flex-start;
    color: var(--text-default-grey);
    display: flex;
    font-size: 1.125rem;
    gap: 0.5rem;
    line-height: 1.75rem;
    margin: 0;
  }

  .icone-fleche {
    align-self: inherit;
    flex-shrink: 0;
    width: 24px;
  }

  .separateur {
    border: none;
    border-top: 1px solid var(--border-default-grey);
    margin-block: 3rem;
  }

  .illustration {
    margin: 0 auto;
    width: 100%;

    .controle-animation {
      text-align: right;
    }
  }

  .controle-animation {
    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  }
</style>
