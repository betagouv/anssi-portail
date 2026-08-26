<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
    elements: HTMLElement[];
    doitEtreOuvert: boolean;
  }

  let { elements, doitEtreOuvert = $bindable() }: Props = $props();

  const gereClic = (e: MouseEvent | KeyboardEvent) => {
    const clicInterieur =
      elements.includes(e.target as HTMLElement) || elements.some((el) => el.contains(e.target as Node));
    if (!clicInterieur) doitEtreOuvert = false;
  };
</script>

<svelte:body use:clic={gereClic} />
