<script lang="ts">
  import FilAriane from '../ui/FilAriane.svelte';
  import Lien from '../ui/Lien.svelte';

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
      illustration: '/assets/images/parcours-securisation/media-parcours-basique-mots-de-passe.svg',
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      illustration: '/assets/images/parcours-securisation/media-parcours-basique-pourquoi.svg',
    },
    {
      titre: 'Pratico-pratique',
      description: 'Des tutos et des outils pour vous aider à faire, concrètement.',
      illustration: '/assets/images/parcours-securisation/media-parcours-basique-comment.svg',
    },
    {
      titre: 'Décrochez votre badge Cyberdépart',
      description: "Un premier marqueur d'engagement pour votre sécurité.",
      badge: {
        label: 'Libellé badge',
        accent: 'green-bourgeon',
        size: 'sm',
        type: 'accent',
      },
      illustration: '/assets/images/parcours-securisation/media-parcours-basique-badge.svg',
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
      illustration: '/assets/images/parcours-securisation/media-parcours-complet-modules.svg',
    },
    {
      titre: 'Basé sur ReCyf',
      description:
        "Chaque mesure est issue du référentiel ReCyf, simplifiée et accompagnée d'explications pédagogiques pour faciliter votre démarche mise en conformité NIS 2.",
      illustration: '/assets/images/parcours-securisation/media-parcours-complet-controler.svg',
    },
    {
      titre: 'Suivez votre progression',
      description:
        'Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire.',
      illustration: '/assets/images/parcours-securisation/media-parcours-complet-progression.svg',
    },
  ];
</script>

<div class="section-hero-et-tuiles">
  <div class="hero">
    <img
      class="forme-decorative"
      src="/assets/images/parcours-securisation/fond-hero-landing-proteger-mon-organisation.svg"
      alt=""
    />
    <dsfr-container class="conteneur-hero">
      <FilAriane feuille="Protéger mon organisation" />
      <div class="grille-hero">
        <div class="contenu-hero">
          <span class="tag-accompagnement">+6000 organisations déjà accompagnées 🚀</span>

          <h1 class="titre alternatif-md">
            Je <span class="decoration-titre"><span>protège</span></span> mon organisation contre les cyberattaques
          </h1>

          <p class="description texte-chapo-xl">Rejoignez notre programme d'accompagnement gratuit.</p>

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

        <div class="illustration-hero">
          <img src="/assets/images/parcours-securisation/media-hero-parcours-securisation.png" alt="" />
        </div>
      </div>
    </dsfr-container>
  </div>

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
      fonctionnalites={fonctionnalitesParcoursBasique}
      cliquable
      avec-cta
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
        href="/inscription"
        markup="a"
      ></dsfr-button>
    </lab-anssi-fonctionnalites>
  </dsfr-container>
</section>

<section class="section-diagnostic">
  <dsfr-container>
    <div class="grille-diagnostic">
      <div class="contenu-diagnostic">
        <h2 class="contenu-diagnostic-titre fr-h4">Vous préférez échanger avec un Aidant cyber ?</h2>
        <p>
          Le diagnostic cyberdépart vous permet de bénéficier d'un accompagnement gratuit d'1 heure avec un Aidant cyber
          bénévole. Retrouvez ensuite votre plan d'action sur MesServicesCyber.
        </p>
        <dsfr-button
          label="Demander un accompagnement gratuit"
          kind="secondary"
          size="lg"
          href="/inscription"
          markup="a"
        ></dsfr-button>
      </div>
      <div class="illustration-diagnostic" aria-hidden="true">
        <img class="photo-diagnostic" src="/assets/images/parcours-securisation/illustration-diagnostic.jpg" alt="" />
        <div class="bulle bulle-aidante">
          <p class="bulle-titre">Amara, Aidante cyber bénévole</p>
          <p class="bulle-detail">32 organisations accompagnées</p>
        </div>
        <div class="bulle bulle-dirigeante">
          <p class="bulle-titre">Julie, dirigeante d'une PME</p>
          <p class="bulle-detail">Julie a fait appel à MesServicesCyber pour se protéger des cyberattaques.</p>
        </div>
      </div>
    </div>
  </dsfr-container>
</section>

<section class="section-parcours-complet">
  <dsfr-container>
    <lab-anssi-fonctionnalites
      titre="Votre organisation agit déjà pour sa cybersécurité ?"
      description="Accédez à 57 mesures pour vous protéger contre les 5 risques cyber les plus courants."
      fonctionnalites={fonctionnalitesParcoursComplet}
      orientation-media="gauche"
      cliquable
      avec-cta
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
        href="/inscription"
        markup="a"
      ></dsfr-button>
    </lab-anssi-fonctionnalites>
  </dsfr-container>
</section>

<section class="section-pied-de-page">
  <dsfr-container>
    <p class="lien-test-maturite">
      <svg
        class="icone-test-maturite"
        width="24"
        height="24"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 9V6L14 10L10 14V11H6V9H10ZM10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0ZM10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18Z"
          fill="var(--text-action-high-blue-france, #000091)"
        />
      </svg>
      Trouvez le parcours adapté à votre organisation à l'aide de notre test de maturité cyber. <Lien
        href="/test-maturite"
        libelle="Débuter le test"
        neutre
      />
    </p>

    <hr class="separateur" />
    <Lien href="/inscription" libelle="Haut de page" taille="md" icone="arrow-up-fill" />
  </dsfr-container>
</section>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  .section-hero-et-tuiles {
    background-color: #fcbfb7;
  }

  .hero {
    background: linear-gradient(177deg, var(--blue-france-925-125, #e3e3fd) 0%, #cacafb 88%);
    overflow: hidden;
    position: relative;
    padding-bottom: 7.5rem;

    .forme-decorative {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      pointer-events: none;
    }

    :global(.conteneur-hero) {
      position: relative;
    }
  }

  .grille-hero {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @include a-partir-de(lg) {
      align-items: center;
      gap: 1.5rem;
      grid-template-columns: taille-pour-colonnes(7) taille-pour-colonnes(5);
    }
  }

  .contenu-hero {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 1rem;
  }

  .illustration-hero {
    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }

  .tag-accompagnement {
    display: inline-flex;
    align-items: center;
    background-color: #c9fcac;
    border-radius: 100px;
    padding: 0.375rem 1rem 0.5rem;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.5rem;
    width: fit-content;
    color: var(--text-title-grey, #161616);
  }

  .titre.alternatif-md {
    margin-block-end: 0;
  }

  .decoration-titre {
    &,
    span {
      position: relative;
    }

    span {
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 120%;
      height: 100%;
      transform: translateX(-50%);
      background: url('/assets/images/parcours-securisation/trait-titre-hero.svg') no-repeat center / contain;
      pointer-events: none;
      z-index: 0;
    }
  }

  .description {
    margin: 0;
  }

  .section-tuiles {
    .conteneur-tuiles {
      padding-block: 0;
    }

    lab-anssi-carrousel-tuiles {
      margin-block-start: -40px;
    }
  }

  .section-parcours-basique {
    background-color: var(--pink-macaron-850-200);
    padding-block: 96px;
  }

  .section-diagnostic {
    padding-block: 56px;
  }

  .grille-diagnostic {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: center;

    @include a-partir-de(lg) {
      grid-template-columns: taille-pour-colonnes(6) taille-pour-colonnes(6);
      gap: 1.5rem;
    }
  }

  .contenu-diagnostic {
    &-titre {
      margin-block-end: 16px;
    }

    p {
      margin-block: 0 24px;
      color: var(--text-default-grey);
    }
  }

  .illustration-diagnostic {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 1.5rem;
  }

  .photo-diagnostic {
    width: 65%;
    border-radius: 0.75rem;
    object-fit: cover;
    aspect-ratio: 1024 / 683;
  }

  .bulle {
    position: absolute;
    background-color: var(--background-default-grey, white);
    border-radius: 0.5rem;
    padding: 0.625rem 0.75rem 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 18, 0.16);

    .bulle-titre {
      font-weight: 700;
      font-size: 0.875rem;
      line-height: 1.4375rem;
      margin: 0;
    }

    .bulle-detail {
      font-size: 0.75rem;
      line-height: 1.3125rem;
      color: var(--text-default-grey, #3a3a3a);
      margin: 0;
    }
  }

  .bulle-aidante {
    top: 0;
    right: 0;

    .bulle-titre {
      color: var(--text-title-blue-france, #000091);
    }
  }

  .bulle-dirigeante {
    bottom: 0;
    left: 0;
    max-width: 16rem;
  }

  .section-parcours-complet {
    background-color: var(--brown-cafe-creme-975-75);
    padding-block: 96px;
  }

  .section-pied-de-page {
    padding-block: 3rem;
  }

  .lien-test-maturite {
    align-items: center;
    color: var(--text-default-grey);
    display: flex;

    font-size: 1.125rem;
    gap: 0.5rem;
    line-height: 1.75rem;
    margin: 0;
  }

  .icone-test-maturite {
    fill: var(--text-action-high-blue-france);
    width: 24px;
  }

  .separateur {
    border: none;
    border-top: 1px solid var(--border-default-grey);
    margin-block: 3rem;
  }
</style>
