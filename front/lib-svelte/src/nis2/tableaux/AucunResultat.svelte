<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
</script>

<div class="aucun-resultat">
  <img
    src="/assets/images/homme-cherchant-avec-loupe.svg"
    alt="Aucun résultat"
  />
  <h3>Désolé, aucun résultat trouvé</h3>
  <dsfr-button
    label="Réinitialiser les filtres"
    has-icon="true"
    icon-place="left"
    icon="close-circle-line"
    use:clic={$exigencesFiltrees.reinitialise}
  ></dsfr-button>
</div>

<style lang="scss">
  .aucun-resultat {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 24px;
    text-align: center;

    h3 {
      margin: 0;
    }

    img {
      width: 140px;
    }
  }
</style>
