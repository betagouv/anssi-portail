<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    libelle: string;
    niveauTitre?: 1 | 2 | 3 | 4 | 5;
    id?: string;
    estOuvert?: boolean;
    children?: Snippet;
  };
  const { libelle, niveauTitre = 3, id, estOuvert, children }: Props = $props();
</script>

<dsfr-accordion {id} title-markup-level={niveauTitre} label={libelle} is-expanded={estOuvert}>
  {@render children?.()}
</dsfr-accordion>
