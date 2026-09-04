<script lang="ts">
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import DemandeDiagnosticSimplifiee from '../../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import EncartPromotionParcoursBasique from '../../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../../parcours-securisation/TagProgrammeGratuit.svelte';
  import PartageTest from '../../test-maturite/PartageTest.svelte';
  import Alternatives from '../../ui/Alternatives.svelte';

  type Props = {
    réponses: boolean[];
  };

  const { réponses }: Props = $props();

  const nombreDeQuestions = $derived(réponses.length);
  const nombreDeBonnesRéponses = $derived(réponses.filter((r) => r).length);
  const { résumé, conseil, couleur } = $derived.by(() => {
    if (nombreDeBonnesRéponses === nombreDeQuestions) {
      return {
        résumé: 'Excellent. Vous connaissez la menace.',
        conseil:
          "Vous avez répondu juste à toutes les questions. Maintenez cette vigilance et partagez ce quiz à vos pairs. Pour aller plus loin, l'ANSSI met à disposition un parcours de sécurisation, à commencer par le Cyberdépart.",
        couleur: 'vert',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 2) {
      return {
        résumé: 'Solide, mais quelques angles morts.',
        conseil:
          "Vous avez de bonnes intuitions, mais certaines idées reçues persistent. L'ANSSI met à disposition un parcours de sécurisation et notamment des ressources pour faire votre Cyberdépart — c'est exactement ce qu'il faut pour combler ces écarts.",
        couleur: 'bleu',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 3) {
      return {
        résumé: 'Certains risques sont encore mal connus.',
        conseil:
          "Plusieurs idées fausses sur la menace peuvent vous coûter cher. Bonne nouvelle : l'ANSSI met à disposition un parcours de sécurisation avec des mesures concrètes pour prendre votre Cyberdépart.",
        couleur: 'bleu',
      };
    }

    return {
      résumé: 'Quelques fondamentaux sont à revoir.',
      conseil:
        "Les écarts entre votre perception et la réalité de la menace sont importants. Ce n'est pas une fatalité : l'ANSSI propose un parcours de sécurisation, à commencer par le Cyberdépart — un point d'entrée adapté aux dirigeants de petites structures.",
      couleur: 'rouge',
    };
  });
  const sourceIllustration = (réponseCorrecte: boolean) =>
    réponseCorrecte ? '/assets/icones/coche-verte.svg' : '/assets/icones/croix-rouge.svg';
  const commentaireIllustration = (réponseCorrecte: boolean, positionQuestion: number, nombreQuestions: number) =>
    `${réponseCorrecte ? 'bonne' : 'mauvaise'} réponse donnée à la question ${positionQuestion} sur ${nombreQuestions}`;
</script>

<dsfr-container>
  <div class={['encart-score', couleur]}>
    <p class="texte-mention-xs">Score</p>
    <p class="alternatif-xs">{nombreDeBonnesRéponses}/{nombreDeQuestions}</p>
    <div class="coches">
      {#each réponses as réponse, index (index)}
        {@const src = sourceIllustration(réponse)}
        {@const alt = commentaireIllustration(réponse, index + 1, nombreDeQuestions)}
        <img {src} {alt} />
      {/each}
    </div>
  </div>

  <div class="contenu">
    <h1>{résumé}</h1>
    <p class="texte-article-lg">{conseil}</p>
    <lab-anssi-icone nom="arrow-down-s-line" taille="lg"></lab-anssi-icone>
  </div>
</dsfr-container>
<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container>
      <DemandeDiagnosticSimplifiee origine="vrai-faux" />
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <dsfr-container class="contenu-encart-parcours-securisation">
      <EncartPromotionParcoursBasique
        titre="13 mesures simples pour protéger votre organisation contre les cyberattaques"
        description="Un programme d'accompagnement gratuit, pensé pour les non-experts."
      >
        {#snippet tags()}
          <TagProgrammeGratuit />
        {/snippet}
      </EncartPromotionParcoursBasique>
    </dsfr-container>
  {/snippet}
</Alternatives>
<dsfr-container>
  <PartageTest />
</dsfr-container>

<style lang="scss">
  @use '../../../../assets/styles/responsive' as *;
  @use '../../../../assets/styles/grille.scss' as *;
  .encart-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    padding: 1rem 2rem 2rem;
    margin-bottom: 3rem;
    background-color: var(--background-alt-blue-france);

    &.vert {
      background-color: var(--success-975-75);
    }
    &.rouge {
      background-color: var(--error-975-75);
    }

    @include a-partir-de(md) {
      margin-inline: auto;
      width: taille-pour-colonnes(10);
    }

    @include a-partir-de(lg) {
      margin-inline: auto;
      width: taille-pour-colonnes(6);
    }

    p {
      margin-bottom: 0;
    }

    .coches {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
    }
  }
  .contenu {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 4.5rem;
  }

  .contenu-encart-parcours-securisation {
    margin-top: 3rem;
    padding: 6rem 0;
    background-color: var(--yellow-moutarde-925-125);
  }
</style>
