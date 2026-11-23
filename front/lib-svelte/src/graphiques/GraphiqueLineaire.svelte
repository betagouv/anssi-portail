<script lang="ts">
  import ConteneurGraphiqueDsfr from './ConteneurGraphiqueDsfr.svelte';

  interface Props {
    x: Array<string>;
    y: Array<number>;
    nom: string;
    unite: string;
    palette?: 'categorical';
  }

  let { x, y, nom, unite, palette = 'categorical' }: Props = $props();
</script>

<ConteneurGraphiqueDsfr>
  <line-chart
    x={JSON.stringify([x])}
    y={JSON.stringify([y])}
    name={JSON.stringify([nom])}
    unit-tooltip={unite}
    selected-palette={palette}
  ></line-chart>
</ConteneurGraphiqueDsfr>
