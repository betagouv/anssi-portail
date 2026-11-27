<script lang="ts">
  import Bouton from '@ui/Bouton.svelte';

  import type { ReferentielSelectionne } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';

  type Props = {
    langueSelectionnee: 'FR' | 'EN';
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    referentielSelectionne: ReferentielSelectionne | '';
  };
  let {
    langueSelectionnee = $bindable('FR'),
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
  }: Props = $props();

  const reinitialise = async () => {
    referentielSelectionne = '';
    sensComparaison = 'NIS2_VERS_CIBLE';
    langueSelectionnee = 'FR';
    $exigencesFiltrees.reinitialise();
  };
</script>

{#if langueSelectionnee !== 'FR' || referentielSelectionne || sensComparaison !== 'NIS2_VERS_CIBLE' || $exigencesFiltrees.filtresActifs}
  <Bouton libelle="Réinitialiser" icone="close-circle-line" type="tertiaire" surClic={reinitialise} />
{/if}
