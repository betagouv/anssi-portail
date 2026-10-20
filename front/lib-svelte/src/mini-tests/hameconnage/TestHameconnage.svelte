<script lang="ts">
  import { fabriqueFilAriane } from '../../ui/filAriane';
  import FilAriane from '../../ui/FilAriane.svelte';
</script>

<dsfr-container>
  <FilAriane
    segments={fabriqueFilAriane({
      feuille: 'Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?',
      branche: { nom: 'Faire le test !', lien: '/faire-le-test' },
    })}
  />
  <h1 class="fr-h6">Hameçonnage : saurez-vous distinguer le mail légitime du faux&nbsp;?</h1>
</dsfr-container>
