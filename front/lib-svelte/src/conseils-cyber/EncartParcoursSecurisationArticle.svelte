<script lang="ts">
  import { onMount } from 'svelte';
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import BadgeOrganisationsAccompagnes from '../demande-aide-mon-aide-cyber/BadgeOrganisationsAccompagnées.svelte';
  import IllustrationHerosParcoursBasique from '../parcours-securisation/animation/IllustrationHerosParcoursBasique.svelte';
  import Lien from '../ui/Lien.svelte';

  const objectif = afficheBadgeCyberdépart ? 'badge Cyberdépart' : 'Cyberdépart';

  let hrefCTA = $state('/modules/1');

  onMount(() => {
    const pageSource = `${window.location.pathname}-encart-article-vers-parcours-cyberdepart`;
    hrefCTA = `/modules/1?pageSource=${pageSource}`;
  });
</script>

<div class="encart fond-moutarde">
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

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  @use '../../../assets/styles/grille.scss' as *;
  .encart {
    display: grid;
    grid-template-columns: 1fr;
    padding: 2.5rem 1rem;
    gap: 1.5rem;

    h3 {
      margin-top: 0.75rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .illustration {
      @include a-partir-de(md) {
        margin-inline: auto;
        width: taille-pour-colonnes(8);
      }
    }
  }
</style>
