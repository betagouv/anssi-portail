<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { onMount, type Snippet } from 'svelte';

  import IllustrationMesure from './animation/IllustrationMesure.svelte';
  import IllustrationPedagogique from './animation/IllustrationPedagogique.svelte';
  import IllustrationTuto from './animation/IllustrationTuto.svelte';
  import IllustrationBadge from './animation/IllustrationBadge.svelte';

  interface Props {
    titre: string;
    description: string;
    tags: Snippet;
  }

  const fonctionnalites = [
    {
      titre: 'Rapides à mettre en place',
      description: '13 mesures accessibles, souvent réalisables en quelques minutes.',
      id: 'mesures',
      rich: true,
    },
    {
      titre: 'Pédagogique',
      description: 'Pas de jargon, on vulgarise la cyber pour vous.',
      id: 'pedagogique',
      rich: true,
    },
    {
      titre: 'Pratico-pratique',
      description: 'Des tutos et des outils pour vous aider à faire, concrètement.',
      id: 'pratico-pratique',
      rich: true,
    },
    {
      titre: 'Décrochez votre badge Cyberdépart',
      description: "Un premier marqueur d'engagement pour votre sécurité.",
      badge: {
        label: 'à la clé',
        accent: 'green-bourgeon',
        size: 'sm',
        type: 'accent',
      },
      id: 'decrochez',
      rich: true,
    },
  ];
  let { titre, description, tags }: Props = $props();
  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}-encart-promotion-parcours-basique`;
  });
</script>

<dsfr-container>
  <lab-anssi-fonctionnalites
    {titre}
    {description}
    fonctionnalites={enPropriétéWebC(fonctionnalites)}
    cliquable
    avec-cta
    active-defilement
  >
    <div slot="hautentete">
      {@render tags()}
    </div>

    <div slot="media-mesures">
      <IllustrationMesure />
    </div>

    <div slot="media-pedagogique">
      <IllustrationPedagogique />
    </div>

    <div slot="media-pratico-pratique">
      <IllustrationTuto />
    </div>

    <div slot="media-decrochez">
      <IllustrationBadge />
    </div>

    <div slot="media">
      <div class="image-animee media-mesures">
        <IllustrationMesure />
      </div>

      <div class="image-animee media-pedagogique">
        <IllustrationPedagogique />
      </div>

      <div class="image-animee media-pratico-pratique">
        <IllustrationTuto />
      </div>

      <div class="image-animee media-decrochez">
        <IllustrationBadge />
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
      href={`/modules/1?pageSource=${pageSource}`}
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

  :global([data-active-item='mesures']) .media-mesures {
    display: block;
  }

  :global([data-active-item='pedagogique']) .media-pedagogique {
    display: block;
  }

  :global([data-active-item='pratico-pratique']) .media-pratico-pratique {
    display: block;
  }

  :global([data-active-item='decrochez']) .media-decrochez {
    display: block;
  }
</style>
