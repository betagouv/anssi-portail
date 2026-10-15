<script lang="ts">
  import type { CodeSecteurContact } from '@anssi-portail/contacts-sectoriels';
  import type { Option } from '../test-maturite/SelecteurSimple';
  import SelecteurSimple from '../test-maturite/SelecteurSimple.svelte';

  type Props = {
    id?: string;
    libelle: string;
    secteur: string;
  };

  let { id = undefined, libelle, secteur = $bindable() }: Props = $props();

  const toutesLesOptions: Record<CodeSecteurContact, string> = {
    aviation: 'Aviation',
    defense: 'Défense',
    sante: 'Santé',
    maritime: 'Maritime',
    'enseignement-recherche': 'Enseignement, recherche',
    social: 'Social',
  };

  const options: Option[] = Object.entries(toutesLesOptions).map(([clef, valeur]) => ({
    valeur: clef,
    libelle: valeur,
  }));
</script>

<SelecteurSimple {id} {libelle} {options} bind:valeurSelectionnee={secteur} optionDefautSelectionnable />
