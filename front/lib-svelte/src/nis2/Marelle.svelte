<script lang="ts">
  import Lien from '../ui/Lien.svelte';

  const etapesMarelle = [
    {
      titre: 'Savoir si votre entité est concernée',
      description:
        'Réalisez un test en ligne pour déterminer si votre entité est régulée par la directive NIS 2 et à quelle catégorie elle appartient.',
      lien: {
        href: '/simulateur-nis2',
        texte: 'Débuter le test',
      },
      illustration: {
        lien: '/assets/images/personne-reflechissant-devant-un-ecran.svg',
        alt: '',
      },
    },
    {
      titre: "Enregistrer votre entité auprès de l'ANSSI",
      description: 'Accédez dès à présent au service de pré-enregistrement en ligne.',
      lien: {
        href: 'https://club.ssi.gouv.fr/#/nis2/introduction',
        texte: 'Se déclarer',
        target: '_blank',
      },
      illustration: {
        lien: '/assets/images/homme-remplissant-ecran-login.svg',
        alt: '',
      },
    },
    {
      titre: 'Agir pour réduire les risques cyber',
      lien: {
        href: '/nis2#solutions',
        texte: "Découvrir les solutions pour m'aider",
        target: '_self',
      },
      illustration: {
        lien: '/assets/images/index-touchant-ecran-demandant-empreinte-digitale.svg',
        alt: '',
      },
    },
  ];

  const retourEnHautDePage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<lab-anssi-marelle titre="NIS&nbsp;2&nbsp;: Comment se lancer&nbsp;?">
  {#each etapesMarelle as etape, index (index)}
    <lab-anssi-marelle-etape {index}>
      <img slot="etape-illustration" src={etape.illustration.lien} alt={etape.illustration.alt} />
      <h4 slot="etape-titre">{etape.titre}</h4>
      {#if index === 2}
        <p slot="etape-description">
          Mettez en oeuvre <Lien
            libelle="les exigences de sécurité"
            href="/nis2#exigences"
            surClic={retourEnHautDePage}
          /> issues de la directive pour réduire vos risques cyber et signalez à l’ANSSI vos incidents de sécurité.
        </p>
      {:else}
        <p slot="etape-description">{etape.description}</p>
      {/if}
      <div slot="etape-lien">
        <Lien libelle={etape.lien.texte} href={etape.lien.href} blank={etape.lien.target === '_blank'} />
      </div>
    </lab-anssi-marelle-etape>
  {/each}
</lab-anssi-marelle>

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
