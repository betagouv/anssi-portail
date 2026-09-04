<script lang="ts">
  import Bouton from '../../../ui/Bouton.svelte';
  import CanonAConfetti from '../../../ui/CanonAConfetti.svelte';
  import FilAriane from '../../../ui/FilAriane.svelte';
  import Question from './question/Question.svelte';

  let mode: 'question' | 'bonne-réponse' | 'mauvaise-réponse' = $state('question');

  const afficheIdéeReçueSuivante = () => {
    mode = 'question';
    indexIdéeReçue = indexIdéeReçue + 1;
  };

  const afficheRéponse = (réponseDonnée: boolean) => {
    const réponseCorrecte = ideéReçueCourante.idéeReçueEstVraie === réponseDonnée;
    mode = réponseCorrecte ? 'bonne-réponse' : 'mauvaise-réponse';
  };

  let indexIdéeReçue = $state(0);
  const idéesReçues = [
    {
      idéeReçue: {
        emoji: '🏢',
        texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      },
      idéeReçueEstVraie: false,
      réponse: 'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      explications: [
        'Les PME, TPE et ETI sont la catégorie la plus touchée.',
        "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.",
      ],
      source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
    },
    {
      idéeReçue: {
        emoji: '🎭',
        texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      },
      idéeReçueEstVraie: false,
      réponse: 'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      explications: [
        'Les PME, TPE et ETI sont la catégorie la plus touchée.',
        "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.",
      ],
      source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
    },
    {
      idéeReçue: {
        emoji: '📥',
        texte: 'Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      },
      idéeReçueEstVraie: false,
      réponse: 'FAUX. Les grandes entreprises sont les principales victimes des rançongiciels, pas les PME et TPE.',
      explications: [
        'Les PME, TPE et ETI sont la catégorie la plus touchée.',
        "En 2025, parmi les victimes d'attaques par rançongiciel portées à la connaissance de l'ANSSI, les PME, TPE et ETI représentent 37 % des cas — c'est la catégorie la plus affectée. Les attaques cybercriminelles ciblent indistinctement la plupart des secteurs et zones géographiques, de façon opportuniste.",
      ],
      source: 'ANSSI, Panorama de la cybermenace 2025, section 1.A — pages 10-11.',
    },
  ];
  const ideéReçueCourante = $derived(idéesReçues[indexIdéeReçue]);
  const badge = $derived.by(() => {
    switch (mode) {
      case 'bonne-réponse':
        return { label: 'Bonne réponse', status: 'success' };
      case 'mauvaise-réponse':
        return { label: 'Mauvaise réponse', status: 'error' };
      default:
        return { label: '', status: '' };
    }
  });
</script>

<dsfr-container>
  <FilAriane
    feuille="Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?"
    branche={{ nom: 'Faire le test !', lien: '/faire-le-test' }}
  />
  <h1 class="fr-h6">Cyber&shy;attaques&nbsp;: saurez-vous démêler le vrai du faux ?</h1>

  {#if mode === 'question'}
    <Question
      question={ideéReçueCourante.idéeReçue.texte}
      {indexIdéeReçue}
      surVoteVrai={() => afficheRéponse(true)}
      surVoteFaux={() => afficheRéponse(false)}
    />
  {:else}
    <div class={['réponse', mode]}>
      <dsfr-badge label={badge.label} size="md" type="status" status={badge.status}></dsfr-badge>
      <dsfr-tag class="compte" size="md" label="{indexIdéeReçue + 1}/6"></dsfr-tag>
      <h2 class="fr-h6">{ideéReçueCourante.réponse}</h2>
      {#each ideéReçueCourante.explications as explication, index (index)}
        <p>{explication}</p>
      {/each}
      <hr />
      <p class="texte-mention-xs">Source : {ideéReçueCourante.source}</p>
      <Bouton libelle="Suivant" surClic={afficheIdéeReçueSuivante} icone="arrow-right-line" iconeADroite />
    </div>
    {#if mode === 'bonne-réponse'}
      <CanonAConfetti lectureAutomatique={true} />
    {/if}
  {/if}
</dsfr-container>

<style lang="scss">
  @use '../../../../../assets/styles/responsive' as *;
  @use '../../../../../assets/styles/grille.scss' as *;

  dsfr-container {
    display: flex;
    background-color: var(--background-alt-blue-france);
    flex-direction: column;

    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }

    &:has(.bonne-réponse) {
      background-color: var(--success-975-75);
    }

    &:has(.mauvaise-réponse) {
      background-color: var(--error-975-75);
    }

    .réponse {
      align-items: center;
      background: var(--background-default-grey);
      border-radius: 0.5rem;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 18, 0.16);
      display: flex;
      flex-flow: row wrap;
      row-gap: 1.5rem;
      grid-template-columns: 1fr auto;
      padding: 2rem;
      justify-content: space-between;
      margin-bottom: 4.5rem;

      @include a-partir-de(md) {
        margin-inline: auto;
        width: taille-pour-colonnes(10);
      }

      @include a-partir-de(lg) {
        margin-inline: auto;
        width: taille-pour-colonnes(6);
      }

      :nth-child(0) {
        flex: 1 100%;
      }
      :nth-child(1) {
        flex: 0 1 auto;
      }
      h2,
      p,
      hr {
        flex: 1 0 100%;
        margin: 0;
      }
      hr {
        height: 1px;
        border: 0;
        background-color: var(--border-default-grey);
      }
      :global(:last-child) {
        margin-inline: auto;
      }
    }
  }
</style>
