<script lang="ts">
  import BlocDeuxColonnes from '../ui/BlocDeuxColonnes.svelte';
  import BlocDiagnostic from '../ui/BlocDiagnostic.svelte';
  import HerosLandingPage from '../ui/HerosLandingPage.svelte';
</script>

<HerosLandingPage
  tag="+6000 organisations déjà accompagnées 🚀"
  titre="Votre cybersécurité décolle en 12&nbsp;mesures"
  description="12 mesures pensées pour les non-spécialistes, applicables en quelques minutes pour commencer à renforcer votre cybersécurité et prendre votre Cyberdépart&nbsp;!"
  propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
  formeDecorative="/assets/images/parcours-securisation/hero-12-mesures-background.svg"
>
  {#snippet actions()}
    <dsfr-button
      label="Je commence à sécuriser"
      kind="primary"
      size="lg"
      has-icon
      icon="arrow-right-circle-line"
      icon-place="right"
    ></dsfr-button>
  {/snippet}
  {#snippet illustration()}
    <div class="composition-illustration">
      <img
        class="photo-hero"
        src="/assets/images/parcours-securisation/hero-12-mesures-illustration.jpg"
        alt="Deux personnes regardant le parcours Cyberdépart sur un ordinateur portable"
      />
      <div class="carte-flottante">
        <span class="badge-carte">🛡️ Sécurité renforcée</span>
        <span class="titre-carte">Faire face aux incidents et aux crises</span>
      </div>
    </div>
    <img class="decorations" src="/assets/images/parcours-securisation/hero-12-mesures-decor.svg" alt="" />
  {/snippet}
</HerosLandingPage>

<section class="section-carrousel-hero">
  <dsfr-container>
    <lab-anssi-carrousel-tuiles>
      <dsfr-tile title="Gratuit" action-markup="false" no-link size="sm"></dsfr-tile>
      <dsfr-tile title="Conçu par l'agence cyber de l'État" action-markup="false" no-link size="sm"></dsfr-tile>
      <dsfr-tile title="100% en ligne" action-markup="false" no-link size="sm"></dsfr-tile>
    </lab-anssi-carrousel-tuiles>
  </dsfr-container>
</section>

<section class="section-contenu">
  <dsfr-container>
    <div class="blocs-contenu">
      <BlocDeuxColonnes
        titre="Rapides à mettre en place"
        paragraphe="12 mesures accessibles, souvent réalisables en quelques minutes pour commencer à vous protéger des cyberattaques."
        ordre="texte-gauche"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-basique-mots-de-passe.svg"
            alt="Carte illustrant une mesure rapide : évitez les mots de passe faciles à deviner"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Pédagogique"
        paragraphe="Pas de jargon, on vulgarise la cyber pour vous."
        ordre="texte-droite"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-basique-pourquoi.svg"
            alt="Vidéo pédagogique : pourquoi activer la vérification en deux étapes"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Pratico-pratique"
        paragraphe="Des tutos et des outils pour vous aider à faire, concrètement."
        ordre="texte-gauche"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-basique-comment.svg"
            alt="Tutoriel pas à pas : comment activer la vérification en deux étapes"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Décrochez votre badge Cyberdépart"
        paragraphe="Valorisez vos efforts et l'engagement de votre organisation dans une première démarche de sécurisation."
        ordre="texte-droite"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-basique-badge.svg"
            alt="Badge Cyberdépart obtenu après avoir complété les 13 mesures"
          />
        {/snippet}
      </BlocDeuxColonnes>
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
      paragraphe="Le diagnostic cyberdépart vous permet de bénéficier d'un accompagnement gratuit d'1 heure avec un Aidant cyber bénévole. Retrouvez ensuite votre plan d'action sur MesServicesCyber."
      labelBouton="Demander un accompagnement gratuit"
    >
      {#snippet illustration()}
        <img
          src="/assets/images/parcours-securisation/illustration-diagnostic.jpg"
          alt="Deux personnes collaborant autour d'un ordinateur portable lors d'un accompagnement cyber"
        />
      {/snippet}
    </BlocDiagnostic>
  </dsfr-container>
</section>

<style lang="scss">
  .composition-illustration {
    position: relative;
  }

  .photo-hero {
    border-radius: 12px;
    width: 100%;
    max-width: 340px;
    height: auto;
    object-fit: cover;
  }

  .carte-flottante {
    position: absolute;
    bottom: -1rem;
    right: -3rem;
    background: var(--background-default-grey);
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 6px 9px rgba(0, 0, 18, 0.16);
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    max-width: 220px;
  }

  .badge-carte {
    display: inline-flex;
    align-items: center;
    background-color: var(--blue-cumulus-950-100);
    border-radius: 4px;
    padding: 0 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: var(--blue-cumulus-sun-368-moon-732);
    text-transform: uppercase;
  }

  .titre-carte {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.5rem;
    color: var(--text-label-grey);
  }

  .decorations {
    position: absolute;
    top: -1rem;
    left: -2rem;
    width: 130px;
    height: auto;
    pointer-events: none;
  }

  .section-carrousel-hero {
    position: relative;
    margin-top: -40px;
    z-index: 2;
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
