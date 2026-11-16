<script lang="ts">
  import { DsfrAccordion } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Props = {
    children?: Snippet;
    estOuvert?: boolean;
    id?: string;
    libelle: string;
    niveauTitre?: 2 | 3 | 4 | 5;
    onclick?: () => void;
  };

  const idParDéfaut = $props.id();
  const { libelle, niveauTitre = 3, id = idParDéfaut, onclick = () => {}, estOuvert, children }: Props = $props();
</script>

<div use:clic={onclick}>
  <DsfrAccordion {id} titleMarkupLevel={niveauTitre} label={libelle} isExpanded={estOuvert}>
    {@render children?.()}
  </DsfrAccordion>
</div>
