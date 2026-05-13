<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    astuce?: Snippet;
    children?: Snippet;
    coche: boolean;
    id: string;
    libelle?: string;
    messageErreur?: string;
    nom?: string;
    requis?: boolean;
  };

  let {
    astuce,
    children,
    coche = $bindable(false),
    id,
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
  onvaluechanged={(e: CustomEvent) => (coche = e.detail)}
  required={requis}
>
  {@render children?.()}
  {#if astuce}
    <span slot="hint">
      {@render astuce()}
    </span>
  {/if}
</dsfr-checkbox>
