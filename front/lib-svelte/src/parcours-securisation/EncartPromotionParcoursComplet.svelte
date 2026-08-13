<script lang="ts">
  import { enPropriétéWebC } from '$plateforme/webComponent';
  import type { Snippet } from 'svelte';
  interface Props {
    titre: string;
    description: string;
    tags: Snippet;
  }

  let { titre, description, tags }: Props = $props();

  const fonctionnalites = [
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
</script>

<dsfr-container>
  <lab-anssi-fonctionnalites
    {titre}
    {description}
    fonctionnalites={enPropriétéWebC(fonctionnalites)}
    orientation-media="gauche"
    cliquable
    avec-cta
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
      href="/parcours-complet"
      markup="a"
    ></dsfr-button>
  </lab-anssi-fonctionnalites>
</dsfr-container>
