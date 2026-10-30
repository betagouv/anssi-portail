<script lang="ts">
  import EncartPromotionParcoursBasique from '../../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../../parcours-securisation/TagProgrammeGratuit.svelte';
  import EnteteAutonome from '../../ui/EnteteAutonome.svelte';

  type Props = {
    réponses: boolean[];
    urlBase?: string;
    mode?: 'autonome';
  };

  const conseils = [
    "Excellent ! Vous êtes très difficile à piéger. Pensez à sensibiliser vos collègues — beaucoup échoueraient à ce quiz.Pour aller plus loin, l'ANSSI met à disposition un parcours de sécurisation, à commencer par le Cyberdépart.",
    "Vous avez de bonnes intuitions, mais certaines idées reçues persistent. Vous détectez la majorité des hameçonnages. Restez attentif aux domaines suspects et aux demandes urgentes, même en interne.disposition un parcours de sécurisation et notamment des ressources pour faire votre Cyberdépart — c'est exactement ce qu'il faut pour combler ces écarts.",
    "Quelques hameçonnages vous ont trompé(e). Vérifiez systématiquement le domaine exact de l'expéditeur, y compris pour les emails « internes ».Bonne nouvelle : l'ANSSI met à disposition un parcours de sécurisation avec des mesures concrètes pour prendre votre Cyberdépart.",
    "Plusieurs hameçonnages vous ont échappé. Retenez les indices clés : domaine exact de l'expéditeur, urgence artificielle, isolement, demandes inhabituelles. Ce n'est pas une fatalité : l'ANSSI propose un parcours de sécurisation, à commencer par le Cyberdépart — un point d'entrée adapté aux dirigeants de petites structures.",
  ];

  const { réponses, urlBase = '', mode }: Props = $props();

  const nombreDeQuestions = $derived(réponses.length);
  const nombreDeBonnesRéponses = $derived(réponses.filter((r) => r).length);
  const { résumé, conseil, couleur } = $derived.by(() => {
    if (nombreDeBonnesRéponses === nombreDeQuestions) {
      return {
        résumé: '🛡️ Vigilance exemplaire\u00a0!',
        conseil: conseils[0],
        couleur: 'vert',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 2) {
      return {
        résumé: '👍 Bon niveau de vigilance',
        conseil: conseils[1],
        couleur: 'bleu',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 3) {
      return {
        résumé: '⚠️ Vigilance à améliorer',
        conseil: conseils[2],
        couleur: 'bleu',
      };
    }

    return {
      résumé: '🎯 À risque — entraînez-vous\u00a0!',
      conseil: conseils[3],
      couleur: 'rouge',
    };
  });
  const sourceIllustration = (réponseCorrecte: boolean) =>
    réponseCorrecte ? `${urlBase}/assets/icones/coche-verte.svg` : `${urlBase}/assets/icones/croix-rouge.svg`;
  const commentaireIllustration = (réponseCorrecte: boolean, positionQuestion: number) =>
    `${réponseCorrecte ? 'bonne' : 'mauvaise'} réponse donnée à la question ${positionQuestion} sur ${nombreDeQuestions}`;
</script>

<dsfr-container>
  {#if mode === 'autonome'}
    <EnteteAutonome {urlBase} />
  {/if}
  <div class={['encart-score', couleur]}>
    <p class="texte-mention-xs">Score</p>
    <p class="alternatif-xs">{nombreDeBonnesRéponses}/{nombreDeQuestions}</p>
    <div class="coches">
      {#each réponses as réponse, index (index)}
        {@const src = sourceIllustration(réponse)}
        {@const alt = commentaireIllustration(réponse, index + 1)}
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
<dsfr-container class="contenu-encart-parcours-securisation">
  <EncartPromotionParcoursBasique
    titre="12 mesures simples pour protéger votre organisation contre les cyberattaques"
    description="Un programme d'accompagnement gratuit, pensé pour les non-experts."
    {mode}
    {urlBase}
  >
    {#snippet tags()}
      <TagProgrammeGratuit />
    {/snippet}
  </EncartPromotionParcoursBasique>
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

  .alternatif-xs {
    font-weight: bold;
    color: var(--text-title-grey);
  }
</style>
