<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    astuce?: Snippet;
    change?: () => void;
    children?: Snippet;
    coche: boolean;
    id: string;
    indetermine?: boolean;
    libelle?: string;
    messageErreur?: string;
    nom?: string;
    requis?: boolean;
  };

  let {
    astuce,
    change,
    children,
    coche = $bindable(false),
    id,
    indetermine = $bindable(false),
    libelle,
    messageErreur = 'Cette information est obligatoire.',
    nom,
    requis,
  }: Props = $props();
</script>

<dsfr-checkbox
  {id}
  name={nom}
  label={libelle}
  error-message={messageErreur}
  checked={coche}
  onvaluechanged={(e: CustomEvent) => {
    coche = e.detail;
    change?.();
  }}
  required={requis}
  indeterminate={indetermine}
>
  {@render children?.()}
  {#if astuce}
    <span slot="hint">
      {@render astuce()}
    </span>
  {/if}
</dsfr-checkbox>
