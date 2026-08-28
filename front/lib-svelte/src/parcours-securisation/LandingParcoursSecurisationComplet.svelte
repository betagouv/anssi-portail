<script lang="ts">
  import type { Component } from 'svelte';
  import HeroLandingPage from '../ui/HeroLandingPage.svelte';
  import BlocContenuLanding from '../ui/BlocContenuLanding.svelte';
  import MotEnExergue from '../ui/MotEnExergue.svelte';
  import IllustrationHerosParcoursComplet from './animation/IllustrationHerosParcoursComplet.svelte';
  import IllustrationModules from './animation/IllustrationModules.svelte';
  import IllustrationPedagogique from './animation/IllustrationPedagogique.svelte';
  import IllustrationProgression from './animation/IllustrationProgression.svelte';
  import IllustrationRecyf from './animation/IllustrationRecyf.svelte';
  import { onMount } from 'svelte';
  import { récupèreStatistiquesMSC, type Statistiques } from '../passerelles/statistiquesMSC';

  let statistiques: Statistiques | undefined = $state();

  type Contenu = {
    titre: string;
    description: string;
    illustration: Component;
  };

  const contenus: Contenu[] = [
    {
      titre: 'Un programme complet',
      description:
        "6 modules pour protéger votre organisation des risques les plus courants : perte de maîtrise, exposition, failles exploitées, usurpation d'identité, crise subie.",
      illustration: IllustrationModules,
    },
    {
      titre: 'Basé sur ReCyF',
      description:
        "Simplifiée et accompagnée d'explications pédagogiques, chaque mesure est issue du référentiel cyber français (ReCyF) pensé pour faciliter la mise en conformité avec NIS 2.",
      illustration: IllustrationRecyf,
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      illustration: IllustrationPedagogique,
    },
    {
      titre: 'Suivez votre progression',
      description:
        'Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire.',
      illustration: IllustrationProgression,
    },
  ];

  let pageSourceHero = $state('');
  let pageSourceCTACentral = $state('');

  onMount(async () => {
    pageSourceHero = `${window.location.pathname}-hero`;
    pageSourceCTACentral = `${window.location.pathname}-cta-central`;
    statistiques = await récupèreStatistiquesMSC();
  });
</script>

<div>
  <HeroLandingPage
    description="Accédez à 6 modules élaborés pour protéger votre organisation contre les risques cyber les plus courants et faciliter votre démarche de mise en conformité NIS&nbsp;2 si vous êtes concerné."
    propriétésFilAriane={{ feuille: 'Protéger mon organisation' }}
    tag={`+${statistiques?.diagnosticsCyberArrondis ?? 0} organisations déjà accompagnées 🚀`}
    class="hero-landing-page"
  >
    {#snippet titreHtml()}
      Engagez votre organisa&shy;tion dans une <MotEnExergue motif="vague" couleur="cafe-creme">démarche</MotEnExergue>
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
        href={`/parcours-complet?pageSource=${pageSourceHero}`}
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
        href={`/parcours-complet?pageSource=${pageSourceCTACentral}`}
        markup="a"
      ></dsfr-button>
    </div>
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

  .illustration {
    margin: 0 auto;
    width: 100%;
  }
</style>
