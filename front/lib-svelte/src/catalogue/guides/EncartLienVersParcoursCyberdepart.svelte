<script lang="ts">
  import { onMount } from 'svelte';
  import { afficheBadgeCyberdépart } from '$plateforme/environnement';
  import BadgeOrganisationsAccompagnées from '../../demande-aide-mon-aide-cyber/BadgeOrganisationsAccompagnées.svelte';
  import Lien from '../../ui/Lien.svelte';
  import Popover from '../../ui/Popover.svelte';

  let hrefCTA = $state('/modules/1');

  onMount(() => {
    const pageSource = `${window.location.pathname}-encart-lien-vers-parcours-cyberdepart`;
    hrefCTA = `/modules/1?pageSource=${pageSource}`;
  });

  const libelléParcours = afficheBadgeCyberdépart
    ? '🏆 Décrochez votre badge Cyberdépart'
    : '🏆 Validez votre Cyberdépart';
</script>

<Popover>
  <BadgeOrganisationsAccompagnées />
  <h3>12 mesures simples pour protéger votre organisation contre les cyberattaques</h3>

  <ul>
    <li><strong>Rapide</strong> à mettre en place</li>
    <li><strong>Pédagogique :</strong> on vulgarise la cyber pour vous</li>
    <li><strong>Pratico-pratique :</strong> des outils pour vous aider</li>
  </ul>
  <div class="appât fond-bleu-france-950"><strong>{libelléParcours}</strong></div>

  {#snippet actions()}
    <Lien
      apparence="bouton"
      etire
      type="primaire"
      libelle="Je commence à sécuriser"
      icone="arrow-right-circle-line"
      iconeADroite
      href={hrefCTA}
    ></Lien>
    <Lien apparence="bouton" etire type="tertiaire-sans-bordure" libelle="En savoir plus" href="/parcours-cyberdepart"
    ></Lien>
  {/snippet}
</Popover>

<style lang="scss">
  h3 {
    margin: 0.5rem 0 1rem;
  }

  ul {
    margin-top: 0;
    padding-left: 0;
    list-style: none;

    li {
      position: relative;
      padding-left: 1.5rem;

      &:not(:last-child) {
        margin-bottom: 1rem;
      }

      &::before {
        position: absolute;
        left: 0;
      }

      &:nth-child(1)::before {
        content: '⚡';
      }

      &:nth-child(2)::before {
        content: '💡';
      }

      &:nth-child(3)::before {
        content: '✅';
      }
    }
  }

  .appât {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
</style>
