<script lang="ts">
  import { clic } from '../directives/actions.svelte';

  interface Props {
    surClic?: (event: MouseEvent | KeyboardEvent) => void;
  }

  let { surClic = () => {} }: Props = $props();
</script>

<dsfr-button label="Fermer" preset="close" role="button" tabindex="0" use:clic={surClic}></dsfr-button>

<style lang="scss">
  dsfr-button {
    align-self: flex-end;
    margin-right: -12px;
  }
</style>
