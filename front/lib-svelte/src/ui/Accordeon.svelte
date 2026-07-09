<script lang="ts">
  import type { Snippet } from 'svelte';
  import { clic } from '../directives/actions.svelte';

  type Props = {
    children?: Snippet;
    estOuvert?: boolean;
    id?: string;
    libelle: string;
    niveauTitre?: 1 | 2 | 3 | 4 | 5;
    onclick?: (event: MouseEvent | KeyboardEvent) => void;
  };
  const { libelle, niveauTitre = 3, id, estOuvert, children, onclick = () => {} }: Props = $props();
</script>

<dsfr-accordion {id} title-markup-level={niveauTitre} label={libelle} is-expanded={estOuvert} use:clic={onclick}>
  {@render children?.()}
</dsfr-accordion>
