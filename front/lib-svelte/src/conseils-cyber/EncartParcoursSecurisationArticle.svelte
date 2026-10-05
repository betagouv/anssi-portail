<script lang="ts">
  import { onMount } from 'svelte';
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import BadgeOrganisationsAccompagnes from '../demande-aide-mon-aide-cyber/BadgeOrganisationsAccompagnées.svelte';
  import IllustrationHerosParcoursBasique from '../parcours-securisation/animation/IllustrationHerosParcoursBasique.svelte';
  import Bouton from '../ui/Bouton.svelte';
  import Lien from '../ui/Lien.svelte';

  const objectif = afficheBadgeCyberdépart ? 'badge Cyberdépart' : 'Cyberdépart';

  let hrefCTA = $state('/modules/1');
  let encart = $state<HTMLDivElement | undefined>();
  let encartVolant = $state<HTMLDivElement | undefined>();
  let fermeParLUtilisateur = false;

  const ouvreDialogue = () => {
    try {
      encartVolant?.showPopover?.();
    } catch {
      // showPopover n'est pas supporté, ou la popup est déjà ouverte
    }
  };

  const fermeDialogue = () => {
    try {
      encartVolant?.hidePopover?.();
    } catch {
      // hidePopover n'est pas supporté
    }
  };

  const fermeDepuisLeBouton = () => {
    fermeParLUtilisateur = true;
    fermeDialogue();
  };

  onMount(() => {
    ouvreDialogue();
    const pageSource = `${window.location.pathname}-encart-article-vers-parcours-cyberdepart`;
    hrefCTA = `/modules/1?pageSource=${pageSource}`;

    if (!encart) return;
    const observateurDIntersection = new IntersectionObserver((entrees) => {
      const encartVisible = entrees.at(-1)?.isIntersecting;
      if (encartVisible) fermeDialogue();
      else if (!fermeParLUtilisateur) ouvreDialogue();
    });
    observateurDIntersection.observe(encart);
    return () => observateurDIntersection.disconnect();
  });
</script>

<div bind:this={encart} class="encart fond-moutarde">
  <div class="titre-et-contenu">
    <BadgeOrganisationsAccompagnes />
    <h3>12 mesures simples pour protéger votre organisation contre les cyberattaques</h3>
    <p><strong>Rapides</strong> à mettre en place</p>
    <p><strong>Pédagogique&nbsp;:</strong> on vulgarise la cyber pour vous</p>
    <p><strong>Pratico-pratique&nbsp;:</strong> des outils pour vous aider</p>
    <p><strong>Validez votre {objectif}</strong></p>
  </div>
  <div class="actions">
    <Lien
      apparence="bouton"
      type="primaire"
      libelle="Je commence à sécuriser"
      icone="arrow-right-circle-line"
      iconeADroite
      href={hrefCTA}
    />
    <Lien apparence="bouton" type="tertiaire-sans-bordure" libelle="En savoir plus" href="/parcours-cyberdepart" />
  </div>
  <div class="illustration">
    <IllustrationHerosParcoursBasique />
  </div>
</div>

<div bind:this={encartVolant} onclose={fermeDialogue} popover="manual" class="fond-moutarde encart-volant">
  <div class="entete">
    <Bouton type="tertiaire-sans-bordure" taille="sm" iconeSeule icone="close-line" surClic={fermeDepuisLeBouton} />
  </div>
  <div class="corps">
    <BadgeOrganisationsAccompagnes />
    <p class="fr-h5">12 mesures simples pour protéger votre organisation contre les cyberattaques</p>
    <Lien apparence="bouton" type="primaire" libelle="Découvrir le programme" href="/parcours-cyberdepart" etire />
  </div>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;
  .encart {
    display: grid;
    grid-template-areas:
      'titre-et-contenu'
      'actions'
      'illustration';
    padding: 2.5rem 1rem;
    gap: 1.5rem;

    @include a-partir-de(lg) {
      grid-template-areas:
        'titre-et-contenu illustration'
        'actions illustration';
      grid-template-columns: repeat(2, 1fr);
    }

    .titre-et-contenu {
      grid-area: titre-et-contenu;
      h3 {
        margin-top: 0.75rem;
      }
    }

    .actions {
      grid-area: actions;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      @include a-partir-de(lg) {
        flex-direction: row;
      }
    }

    .illustration {
      grid-area: illustration;
      display: flex;
      align-items: center;
      @include a-partir-de(md) {
        margin-inline: auto;
        width: taille-pour-colonnes(8);
      }
      @include a-partir-de(lg) {
        width: 100%;
      }
    }
  }

  .encart-volant {
    display: flex;
    flex-direction: column;
    border: 0;
    padding: 0;
    box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 0.16);
    gap: 0;
    margin: 0;
    inset: 50% 1rem auto auto;
    z-index: 9;
    width: 282px;
    transform: translate(100%, -50%);

    &[popover]:popover-open {
      display: flex;
      transform: translate(0, -50%);
    }

    @starting-style {
      &[popover]:popover-open {
        transform: translate(100%, -50%);
      }
    }

    &[popover] {
      display: none;
      transition:
        display 0.5s allow-discrete,
        transform 0.5s ease;

      transform: translate(100%, -50%);
    }

    .entete {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 0.25rem;
      padding-bottom: 0;

      @include a-partir-de(lg) {
        height: 160px;
        background: url('/assets/images/parcours-securisation/animation/heros-parcours-basique.avif') center / cover
          no-repeat;

        :global(dsfr-button) {
          background-color: white;
        }
      }

      :global(dsfr-button) {
        min-height: initial;
      }
    }

    .corps {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      padding-top: 0;
      .fr-h5 {
        margin-top: 0.5rem;
      }

      @include a-partir-de(lg) {
        padding: 1.5rem;
        padding-top: 1rem;
      }
    }
  }
</style>
