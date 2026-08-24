<script lang="ts">
  interface Props {
    texteAlternatif: string;
    largeurMax?: string;
  }

  let { texteAlternatif, largeurMax }: Props = $props();
</script>

<img
  src="/assets/images/illustration-dragon-aucun-resultat.svg"
  width="175"
  height="317"
  alt={texteAlternatif}
  style:max-width={largeurMax}
/>
