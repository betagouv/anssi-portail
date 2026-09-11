<script lang="ts">
  interface Props {
    texteAlternatif: string;
    petit?: boolean;
  }

  let { texteAlternatif, petit = false }: Props = $props();
</script>

<img
  src="/assets/images/illustration-dragon-aucun-resultat.svg"
  width="175"
  height="317"
  alt={texteAlternatif}
  class:petit
/>

<style lang="scss">
  .petit {
    max-width: 282px;
  }
</style>
