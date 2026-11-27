<script lang="ts">
  import { DsfrCheckbox } from '@lab-anssi/ui-kit';
  import type { Snippet } from 'svelte';

  type Props = {
    astuce?: Snippet;
    surChangement?: () => void;
    children?: Snippet;
    coché?: boolean;
    enErreur?: boolean;
    id: string;
    indéterminé?: boolean;
    libellé?: string;
    messageErreur?: string;
    nom?: string;
    requis?: boolean;
    taille?: 'sm' | 'md';
  };

  let {
    astuce,
    surChangement,
    children,
    coché = $bindable(false),
    enErreur,
    id,
    indéterminé = $bindable(false),
    libellé,
    messageErreur = 'Cette information est obligatoire.',
    nom,
    requis,
    taille,
  }: Props = $props();
</script>

<DsfrCheckbox
  {id}
  checked={coché}
  errorMessage={messageErreur}
  indeterminate={indéterminé}
  label={libellé}
  name={nom}
  onvaluechanged={(nouvelleÉtat) => {
    coché = nouvelleÉtat;
    surChangement?.();
  }}
  required={requis}
  size={taille}
  status={enErreur ? 'error' : undefined}
>
  {@render children?.()}
  <svelte:fragment slot="hint">
    {#if astuce}
      {@render astuce()}
    {/if}
  </svelte:fragment>
</DsfrCheckbox>
