<script lang="ts">
  import type { Option } from './SelecteurSimple';

  type Props = {
    id?: string;
    libelle: string;
    options: Option[];
    valeurSelectionnee: string | object;
    optionDefautIntitule?: string;
    optionDefautSelectionnable?: boolean;
  };

  let {
    id = `select-${Math.random().toString(36).substring(2, 15)}`,
    libelle,
    options,
    valeurSelectionnee = $bindable(),
    optionDefautIntitule = 'Sélectionner une option',
    optionDefautSelectionnable = false,
  }: Props = $props();
</script>

<dsfr-select
  {id}
  label={libelle}
  placeholder={optionDefautIntitule}
  placeholderDisabled={!optionDefautSelectionnable}
  options={options.map((o) => ({ label: o.libelle, value: o.valeur }))}
  value={valeurSelectionnee}
  onvaluechanged={(e: CustomEvent<string | object>) => (valeurSelectionnee = e.detail)}
>
</dsfr-select>
