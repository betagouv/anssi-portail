<script lang="ts">
  import type { Option } from '../test-maturite/SelecteurSimple';
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { secteursContacts } from './contacts.type';

  type Props = {
    libelle: string;
    secteur: string;
  };

  let { libelle, secteur = $bindable() }: Props = $props();

  const options: Option[] = secteursContacts.map((s) => ({
    valeur: s.valeur,
    libelle: s.libelle,
  }));
</script>

<SelecteurSimple {libelle} {options} bind:valeurSelectionnee={secteur} optionDefautSelectionnable />
