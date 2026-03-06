<script lang="ts">
  import { clic } from '../../directives/actions.svelte';
  import type { ReferentielSelectionne } from '../exigence.type';
  import { exigencesFiltrees } from '../stores/exigencesFiltrees.store';

  type Props = {
    sensComparaison: 'NIS2_VERS_CIBLE' | 'SOURCE_VERS_NIS2';
    referentielSelectionne: ReferentielSelectionne | undefined;
  };
  let {
    sensComparaison = $bindable(),
    referentielSelectionne = $bindable(),
  }: Props = $props();

  const reinitialise = async () => {
    referentielSelectionne = undefined;
    sensComparaison = 'NIS2_VERS_CIBLE';
    $exigencesFiltrees.reinitialise();
  };
</script>

{#if referentielSelectionne || sensComparaison !== 'NIS2_VERS_CIBLE' || $exigencesFiltrees.filtresActifs}
  <dsfr-button
    label="Réinitialiser"
    has-icon="true"
    icon-place="left"
    icon="close-circle-line"
    kind="tertiary"
    use:clic={reinitialise}
  ></dsfr-button>
{/if}
