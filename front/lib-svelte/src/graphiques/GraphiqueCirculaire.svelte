<script lang="ts">
  import ConteneurGraphiqueDsfr from './ConteneurGraphiqueDsfr.svelte';

  interface Props {
    x: Array<string>;
    y: Array<number>;
    unite: string;
    palette?: 'categorical';
    plein?: boolean;
  }

  let { x, y, unite, palette = 'categorical', plein = false }: Props = $props();
</script>

<ConteneurGraphiqueDsfr>
  <pie-chart
    x={JSON.stringify([x])}
    y={JSON.stringify([y])}
    name={JSON.stringify(x)}
    unit-tooltip={unite}
    selected-palette={palette}
    fill={plein}
  ></pie-chart>
</ConteneurGraphiqueDsfr>
