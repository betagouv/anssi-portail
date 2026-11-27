<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    astuce?: Snippet;
    surChangement?: () => void;
    children?: Snippet;
    coché: boolean;
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

<dsfr-checkbox
  {id}
  checked={coché}
  error-message={messageErreur}
  indeterminate={indéterminé}
  label={libellé}
  name={nom}
  onvaluechanged={(e: CustomEvent) => {
    coché = e.detail;
    surChangement?.();
  }}
  required={requis}
  size={taille}
  status={enErreur ? 'error' : undefined}
>
  {@render children?.()}
  {#if astuce}
    <span slot="hint">
      {@render astuce()}
    </span>
  {/if}
</dsfr-checkbox>
