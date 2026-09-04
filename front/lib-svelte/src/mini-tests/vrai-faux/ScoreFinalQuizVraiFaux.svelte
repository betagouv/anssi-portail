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

  const nombreDeBonnesRéponses = $derived(réponses.filter((r) => r).length);
  const sourceIllustration = (réponseCorrecte: boolean) =>
    réponseCorrecte ? '/assets/icones/coche-verte.svg' : '/assets/icones/croix-rouge.svg';
  const commentaireIllustration = (réponseCorrecte: boolean, positionQuestion: number, nombreQuestions: number) =>
    `${réponseCorrecte ? 'bonne' : 'mauvaise'} réponse donnée à la question ${positionQuestion} sur ${nombreQuestions}`;
</script>

<dsfr-container>
  <div class="encart-score">
    <p class="texte-mention-xs">Score</p>
    <p class="alternatif-xs">{nombreDeBonnesRéponses}/{réponses.length}</p>
    <div class="coches">
      {#each réponses as réponse, index (index)}
        {@const src = sourceIllustration(réponse)}
        {@const alt = commentaireIllustration(réponse, index + 1, réponses.length)}
        <img {src} {alt} />
      {/each}
    </div>
  </div>

  <div class="contenu">
    <h1>Quelques fondamentaux sont à revoir.</h1>
    <p class="texte-article-lg">
      Les écarts entre votre perception et la réalité de la menace sont importants. Ce n'est pas une fatalité : l'ANSSI
      propose un parcours de sécurisation, à commencer par le Cyberdépart — un point d'entrée adapté aux dirigeants de
      petites structures.
    </p>
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
  .encart-score {
    background-color: var(--error-975-75);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 2rem 2rem;
    gap: 1.5rem;
    margin-bottom: 3rem;

    p {
      margin-bottom: 0;
    }

    .coches {
      display: flex;
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
