<script lang="ts">
  import { onMount } from 'svelte';
  import BadgeOrganisationsAccompagnées from '../../demande-aide-mon-aide-cyber/BadgeOrganisationsAccompagnées.svelte';
  import Lien from '../../ui/Lien.svelte';
  import Popover from '../../ui/Popover.svelte';

  let hrefCTA = $state('/parcours-complet');

  onMount(() => {
    const pageSource = `${window.location.pathname}-encart-lien-vers-parcours-cyberdepart`;
    hrefCTA = `/parcours-complet?pageSource=${pageSource}`;
  });
</script>

<Popover>
  <BadgeOrganisationsAccompagnées />
  <h3>Renforcez gratuitement la cybersécurité de votre organisation</h3>

  <ul>
    <li>58 mesures pour vous protéger des 5 risques cyber les plus courants</li>
    <li>Basées sur ReCyF et simplifiée pour faciliter votre démarche de mise en conformité NIS 2</li>
    <li>Évaluez votre progression et partagez vos résultats</li>
  </ul>

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
    <Lien
      apparence="bouton"
      etire
      type="tertiaire-sans-bordure"
      libelle="En savoir plus"
      href="/parcours-securisation-complet"
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
        content: '🛡️';
      }

      &:nth-child(2)::before {
        content: '✅';
      }

      &:nth-child(3)::before {
        content: '📈';
      }
    }
  }
</style>
