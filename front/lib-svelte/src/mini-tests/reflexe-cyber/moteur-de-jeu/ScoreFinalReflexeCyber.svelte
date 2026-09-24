<script lang="ts">
  import { onMount } from 'svelte';
  import { afficheParcoursSecurisation } from '$plateforme/environnement';
  import DemandeDiagnosticSimplifiee from '../../../demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte';
  import EncartPromotionParcoursBasique from '../../../parcours-securisation/EncartPromotionParcoursBasique.svelte';
  import TagProgrammeGratuit from '../../../parcours-securisation/TagProgrammeGratuit.svelte';
  import PartageTest from '../../../test-maturite/PartageTest.svelte';
  import Alternatives from '../../../ui/Alternatives.svelte';

  type Props = {
    réponses: boolean[];
  };

  const conseils = [
    'Vous avez pris les bonnes décisions à chaque étape de la cyberattaque. Pour aller plus loin et mieux préparer votre organisation en amont, poursuivez avec le parcours de sécurisation de l’ANSSI, à commencer par Cyberdépart.',
    'Vous avez pris la plupart des bonnes décisions face à cette cyberattaque. Quelques réflexes peuvent encore être renforcés pour mieux limiter les conséquences d’un incident. Le parcours de sécurisation de l’ANSSI peut vous y aider.',
    'En situation de crise, quelques décisions clés peuvent faire la différence. Le parcours de sécurisation de l’ANSSI vous aide à mieux préparer votre organisation et à adopter les bons réflexes, en commençant par Cyberdépart.',
    'Face à une cyberattaque, certaines décisions peuvent rapidement aggraver la situation. Le parcours de sécurisation de l’ANSSI, à commencer par Cyberdépart, vous aide à mettre en place les mesures essentielles pour mieux vous préparer et réagir.',
  ];

  const { réponses }: Props = $props();

  const nombreDeQuestions = $derived(réponses.length);
  const nombreDeBonnesRéponses = $derived(réponses.filter((r) => r).length);
  const { résumé, conseil, couleur } = $derived.by(() => {
    if (nombreDeBonnesRéponses === nombreDeQuestions) {
      return {
        résumé: 'Excellent. Vous avez adopté les bons réflexes.',
        conseil: conseils[0],
        couleur: 'vert',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 2) {
      return {
        résumé: 'De bons réflexes, avec quelques points de vigilance.',
        conseil: conseils[1],
        couleur: 'bleu',
      };
    }
    if (nombreDeBonnesRéponses >= nombreDeQuestions - 3) {
      return {
        résumé: 'Vous avez certains bons réflexes, mais des points restent à renforcer.',
        conseil: conseils[2],
        couleur: 'bleu',
      };
    }

    return {
      résumé: 'Les bons réflexes restent à acquérir.',
      conseil: conseils[3],
      couleur: 'rouge',
    };
  });
  const sourceIllustration = (réponseCorrecte: boolean) =>
    réponseCorrecte ? '/assets/icones/coche-verte.svg' : '/assets/icones/croix-rouge.svg';
  const commentaireIllustration = (réponseCorrecte: boolean, positionQuestion: number) =>
    `${réponseCorrecte ? 'bonne' : 'mauvaise'} réponse donnée à la question ${positionQuestion} sur ${nombreDeQuestions}`;

  onMount(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>

<dsfr-container>
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
<Alternatives affichageAlternatif={afficheParcoursSecurisation}>
  {#snippet défaut()}
    <dsfr-container>
      <DemandeDiagnosticSimplifiee origine="réflexes-cyber-en-ligne" />
    </dsfr-container>
  {/snippet}
  {#snippet alternatif()}
    <dsfr-container class="contenu-encart-parcours-securisation">
      <EncartPromotionParcoursBasique
        titre="12 mesures simples pour protéger votre organisation contre les cyberattaques"
        description="Un programme d'accompagnement gratuit, pensé pour les non-experts."
      >
        {#snippet tags()}
          <TagProgrammeGratuit />
        {/snippet}
      </EncartPromotionParcoursBasique>
    </dsfr-container>
  {/snippet}
</Alternatives>

<dsfr-container class="conteneur-carte-guide">
  <dsfr-card
    class="guide-reflexes"
    title="Organisez une session Réflexes Cyber en équipe !"
    has-detail-end
    detail-end=""
    size="lg"
    horizontal
    horizontal-proportion="tier"
    has-description="true"
    description="Avec RÉFLEXES CYBER faites vivre à votre CODIR/COMEX ou à vos équipes une première simulation de crise d’origine cyber. Tout au long de la simulation, avec l’aide d’une personne chargée d’animer la séquence, les participant(e)s sont confronté(e)s à des évènements imprévus et doivent prendre des décisions&nbsp;: qui adoptera les bons ou les mauvais réflexes&nbsp;?&nbsp;😉"
    src="/assets/images/illustrations-services/reflexes-cyber/RC-home.png"
    href="/ressources/reflexes-cyber"
    enlarge="true"
  >
  </dsfr-card>
</dsfr-container>

<dsfr-container>
  <PartageTest
    cheminPartagé="/reflexes-cyber-en-ligne/parcours"
    sujetMail="Comment réagirez-vous en cas de cyberattaque ?"
    typeDeRetour="reflexes-cyber"
  />
</dsfr-container>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;
  @use '../../../../../assets/styles/grille.scss' as *;

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

  .conteneur-carte-guide {
    padding-top: 3rem;

    .guide-reflexes {
      min-height: 0;
    }
  }
</style>
