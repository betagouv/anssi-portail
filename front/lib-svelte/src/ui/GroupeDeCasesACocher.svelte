<script lang="ts">
  import { DsfrCheckboxesGroup } from '@lab-anssi/ui-kit';

  type CaseÀCocher = {
    id: string;
    libellé: string;
    valeur: string;
  };

  type Props = {
    id: string;
    légende: string;
    casesÀCocher: CaseÀCocher[];
    surChangement: (values: string[]) => void;
    astuce?: string;
  };

  const { astuce, id, légende, casesÀCocher, surChangement }: Props = $props();
  const checkboxes = $derived(
    casesÀCocher.map((caseÀCocher: CaseÀCocher) => ({
      ...caseÀCocher,
      label: caseÀCocher.libellé,
      value: caseÀCocher.valeur,
    }))
  );
</script>

<DsfrCheckboxesGroup {id} hint={astuce} legend={légende} {checkboxes} onvalueschanged={surChangement} />
