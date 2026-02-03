<script lang="ts">
  const etapesMarelle = [
    {
      titre: 'Savoir si votre entité est concernée',
      description:
        'Réalisez un test en ligne pour déterminer si votre entité est régulée par la directive NIS 2 et à quelle catégorie elle appartient.',
      lien: {
        href: '#',
        texte: 'Débuter le test',
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/personne-reflechissant-devant-un-ecran.svg',
        alt: '',
      },
    },

    {
      titre: 'Enregistrer votre entité auprès de l\'ANSSI',
      description:
        'Accédez dès à présent au service de pré-enregistrement en ligne.',
      lien: {
        href: '#',
        texte: 'Se déclarer',
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/homme-remplissant-ecran-login.svg',
        alt: '',
      },
    },
    {
      titre: 'Agir pour réduire les risques cyber',
      description:
        'Mettez en oeuvre les exigences de sécurité issues de la directive pour réduire vos risques cyber et signalez à l’ANSSI vos incidents de sécurité. ',
      lien: {
        href: '#',
        texte: 'Découvrir les solutions pour m\'aider',
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/index-touchant-ecran-demandant-empreinte-digitale.svg',
        alt: '',
      },
    },
  ];
</script>

<lab-anssi-marelle
  titre="NIS&nbsp;2&nbsp;: Comment se lancer&nbsp;?"
  etapesmarelle={etapesMarelle}
></lab-anssi-marelle>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille' as *;

  lab-anssi-marelle {
    margin-inline: auto;
    display: block;
    @include a-partir-de(lg) {
      max-width: taille-pour-colonnes(10);
    }
  }
</style>
