<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    astuce?: Snippet;
    surChangement?: () => void;
    children?: Snippet;
    coché: boolean;
    id: string;
    indéterminé?: boolean;
    libellé?: string;
    messageErreur?: string;
    nom?: string;
    requis?: boolean;
  };

  let {
    astuce,
    surChangement,
    children,
    coché = $bindable(false),
    id,
    indéterminé = $bindable(false),
    libellé,
    messageErreur = 'Cette information est obligatoire.',
    nom,
    requis,
  }: Props = $props();
</script>

<dsfr-checkbox
  {id}
  name={nom}
  label={libellé}
  error-message={messageErreur}
  checked={coché}
  onvaluechanged={(e: CustomEvent) => {
    coché = e.detail;
    surChangement?.();
  }}
  required={requis}
  indeterminate={indéterminé}
>
  {@render children?.()}
  {#if astuce}
    <span slot="hint">
      {@render astuce()}
    </span>
  {/if}
</dsfr-checkbox>
