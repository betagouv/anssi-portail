<script lang="ts">
  import Bouton from '@ui/Bouton.svelte';
  import IllustrationPasDeResultatDeRecherche from '@ui/IllustrationPasDeResultatDeRecherche.svelte';

  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';
</script>

<div class="aucun-resultat">
  <div class="illustration">
    <IllustrationPasDeResultatDeRecherche />
  </div>
  <h3>Désolé, aucun résultat trouvé</h3>

  <Bouton libelle="Réinitialiser les filtres" icone="close-circle-line" surClic={$exigencesFiltrees.reinitialise} />
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

    .illustration {
      height: 140px;
    }
  }
</style>
