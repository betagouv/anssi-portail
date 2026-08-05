<script lang="ts">
  import BlocDeuxColonnes from '../ui/BlocDeuxColonnes.svelte';
  import HerosLandingPage from '../ui/HerosLandingPage.svelte';
</script>

<HerosLandingPage
  tag="+6000 organisations déjà accompagnées 🚀"
  titre="Engagez votre organisation dans une d&eacute;marche cyber compl&egrave;te"
  description="Acc&eacute;dez &agrave; 6 modules &eacute;labor&eacute;s pour prot&eacute;ger votre organisation contre les risques cyber les plus courants et faciliter votre d&eacute;marche de mise en conformit&eacute; NIS&nbsp;2 si vous &ecirc;tes concern&eacute;."
  propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
  formeDecorative="/assets/images/parcours-cyberdepart/forme-decorative-hero.svg"
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
        src="/assets/images/parcours-securisation/hero-parcours-complet-illustration.png"
        alt="Personne consultant le parcours de sécurisation complet sur un ordinateur portable"
      />
      <div class="carte-flottante">
        <span class="badge-carte">🚨 Surveillance active</span>
        <span class="titre-carte">Réduire son exposition à la menace cyber</span>
      </div>
    </div>
    <img class="decorations" src="/assets/images/parcours-cyberdepart/decorations-hero.svg" alt="" />
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
        titre="Un programme complet"
        paragraphe="6 modules pour protéger votre organisation des risques les plus courants — 6 mesures additionnelles sur la protection des données personnelles, établies avec la CNIL."
        ordre="texte-gauche"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-complet-modules.svg"
            alt="Aperçu des 6 modules du parcours de sécurisation complet"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Basé sur ReCyF"
        paragraphe="Chaque mesure est issue du référentiel cyber français (ReCyF), simplifiée et accompagnée d'explications pédagogiques pour faciliter votre démarche mise en conformité NIS 2."
        ordre="texte-droite"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-complet-controler.svg"
            alt="Carte illustrant une mesure basée sur le référentiel ReCyF"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Pédagogique"
        paragraphe="Pas de jargon, on vulgarise la cyber pour vous."
        ordre="texte-gauche"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-complet-pourquoi.svg"
            alt="Vidéo pédagogique : pourquoi activer la vérification en deux étapes"
          />
        {/snippet}
      </BlocDeuxColonnes>

      <BlocDeuxColonnes
        titre="Suivez votre progression"
        paragraphe="Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire."
        ordre="texte-droite"
      >
        {#snippet illustration()}
          <img
            src="/assets/images/parcours-securisation/media-parcours-complet-progression.svg"
            alt="Carte de suivi de progression avec barre de complétion"
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
</style>
