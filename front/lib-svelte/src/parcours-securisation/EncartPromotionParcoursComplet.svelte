<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { onMount, type Snippet } from 'svelte';

  import IllustrationModules from './animation/IllustrationModules.svelte';
  import IllustrationRecyf from './animation/IllustrationRecyf.svelte';
  import IllustrationProgression from './animation/IllustrationProgression.svelte';

  interface Props {
    titre: string;
    description: string;
    orientation?: 'gauche' | 'droite';
    tags: Snippet;
  }

  let { titre, description, tags, orientation = 'gauche' }: Props = $props();

  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}-encart-promotion-parcours-complet`;
  });

  const fonctionnalites = [
    {
      titre: 'Un programme complet',
      description:
        "Protégez-vous contre les 5 risques cyber les plus courants : perte de maîtrise, exposition, failles exploitées, usurpation d'identité, crise subie.",
      id: 'modules',
      rich: true,
    },
    {
      titre: 'Basé sur ReCyf',
      description:
        "Chaque mesure est issue du référentiel ReCyf, simplifiée et accompagnée d'explications pédagogiques pour faciliter votre démarche de mise en conformité NIS 2.",
      id: 'recyf',
      rich: true,
    },
    {
      titre: 'Suivez votre progression',
      description:
        'Avancez à votre rythme, module par module. Visualisez votre progression à tout moment et partagez vos résultats avec votre direction ou votre prestataire.',
      id: 'progression',
      rich: true,
    },
  ];
</script>

<dsfr-container>
  <lab-anssi-fonctionnalites
    {titre}
    {description}
    fonctionnalites={enPropriétéWebC(fonctionnalites)}
    orientation-media={orientation}
    cliquable
    avec-cta
    active-defilement
  >
    <div slot="hautentete">
      {@render tags()}
    </div>

    <div slot="media-modules">
      <IllustrationModules />
    </div>

    <div slot="media-recyf">
      <IllustrationRecyf />
    </div>

    <div slot="media-progression">
      <IllustrationProgression />
    </div>

    <div slot="media">
      <div class="image-animee media-modules">
        <IllustrationModules />
      </div>

      <div class="image-animee media-recyf">
        <IllustrationRecyf />
      </div>

      <div class="image-animee media-progression">
        <IllustrationProgression />
      </div>
    </div>

    <dsfr-button
      label="Je commence à sécuriser"
      kind="primary"
      size="lg"
      has-icon
      icon="arrow-right-circle-line"
      icon-place="right"
      slot="cta"
      href={`/parcours-complet?pageSource=${pageSource}`}
      markup="a"
    ></dsfr-button>
  </lab-anssi-fonctionnalites>
</dsfr-container>

<style lang="scss">
  [slot='media'] {
    max-width: 486px;
    width: 100%;
  }

  .image-animee,
  lab-anssi-fonctionnalites:not(:defined) [slot^='media'] {
    display: none;
  }

  :global([data-active-item='modules']) .media-modules {
    display: block;
  }

  :global([data-active-item='recyf']) .media-recyf {
    display: block;
  }

  :global([data-active-item='progression']) .media-progression {
    display: block;
  }
</style>
