<script lang="ts">
  import { onMount, type Component } from 'svelte';
  import BlocContenuLanding from '../ui/BlocContenuLanding.svelte';
  import BlocDiagnostic from '../ui/BlocDiagnostic.svelte';
  import HeroLandingPage from '../ui/HeroLandingPage.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';
  import IllustrationBadge from './animation/IllustrationBadge.svelte';
  import IllustrationHerosParcoursBasique from './animation/IllustrationHerosParcoursBasique.svelte';
  import IllustrationMesure from './animation/IllustrationMesure.svelte';
  import IllustrationPedagogique from './animation/IllustrationPedagogique.svelte';
  import IllustrationTuto from './animation/IllustrationTuto.svelte';

  type Contenu = {
    titre: string;
    description: string;
    illustration: Component;
  };

  const contenus: Contenu[] = [
    {
      titre: 'Rapides à mettre en place',
      description:
        '12 mesures accessibles, souvent réalisables en quelques minutes pour commencer à vous protéger des cyberattaques.',
      illustration: IllustrationMesure,
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      illustration: IllustrationPedagogique,
    },
    {
      titre: 'Pratico-pratique',
      description: 'Des tutos et des outils pour vous aider à faire, concrètement.',
      illustration: IllustrationTuto,
    },
    {
      titre: 'Décrochez votre badge Cyberdépart',
      description:
        "Valorisez vos efforts et l'engagement de votre organisation dans une première démarche de sécurisation.",
      illustration: IllustrationBadge,
    },
  ];

  let pageSourceHero = $state('');
  let pageSourceCTACentral = $state('');

  onMount(() => {
    pageSourceHero = `${window.location.pathname}-hero`;
    pageSourceCTACentral = `${window.location.pathname}-cta-central`;
  });
</script>

<div class="section-hero-et-tuiles">
  <HeroLandingPage
    description="12 mesures pensées pour les non-spécialistes, applicables en quelques minutes pour commencer à renforcer votre cybersécurité et prendre votre Cyberdépart&nbsp;!"
    propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
    tag="+6000 organisations déjà accompagnées 🚀"
    class="hero-landing-page"
  >
    {#snippet titreHtml()}
      Votre cybersécurité décolle en <MotEnExergue motif="vague" couleur="cafe-creme">12&nbsp;mesures</MotEnExergue>
    {/snippet}
    {#snippet actions()}
      <dsfr-button
        label="Je commence à sécuriser"
        kind="primary"
        size="lg"
        has-icon
        icon="arrow-right-circle-line"
        icon-place="right"
        href={`/modules/1?pageSource=${pageSourceHero}`}
        markup="a"
      ></dsfr-button>
    {/snippet}
    {#snippet illustration()}
      <figure class="illustration">
        <IllustrationHerosParcoursBasique />
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
        {@const Illustration = contenu.illustration}
        <BlocContenuLanding
          titre={contenu.titre}
          description={contenu.description}
          alignement={index % 2 === 0 ? 'texte-gauche' : 'texte-droite'}
        >
          {#snippet illustration()}
            <Illustration />
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
        href={`/modules/1?pageSource=${pageSourceCTACentral}`}
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
      lienBouton="/cyberdepart?origine=landing-parcours-cyberdepart"
    >
      {#snippet illustration()}
        <img src="/assets/images/parcours-securisation/illustration-diagnostic.png" alt="" />
      {/snippet}
    </BlocDiagnostic>
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

  .section-diagnostic {
    background-color: var(--background-alt-brown-cafe-creme);
    padding-block: 3.5rem;
  }

  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
