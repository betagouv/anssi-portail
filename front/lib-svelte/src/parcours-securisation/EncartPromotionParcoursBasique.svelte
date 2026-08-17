<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import { onMount, type Snippet } from 'svelte';
  interface Props {
    titre: string;
    description: string;
    tags: Snippet;
  }

  const fonctionnalites = [
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
        label: 'à la clé',
        accent: 'green-bourgeon',
        size: 'sm',
        type: 'accent',
      },
      illustration: '/assets/images/parcours-securisation/illustration-parcours-basique-badge.svg',
    },
  ];
  let { titre, description, tags }: Props = $props();
  let pageSource = $state('');

  onMount(() => {
    pageSource = `${window.location.pathname}#encart-promotion-parcours-basique`;
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
