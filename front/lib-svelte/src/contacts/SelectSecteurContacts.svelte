<script lang="ts">
  import type { Option } from '../test-maturite/SelecteurSimple';
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';
  import { secteursContacts } from './contacts.type';

  type Props = {
    id?: string;
    libelle: string;
    secteur: string;
  };

  let { id = undefined, libelle, secteur = $bindable() }: Props = $props();

  const options: Option[] = secteursContacts.map((s) => ({
    valeur: s.valeur,
    libelle: s.libelle,
  }));
</script>

<SelecteurSimple {id} {libelle} {options} bind:valeurSelectionnee={secteur} optionDefautSelectionnable />
