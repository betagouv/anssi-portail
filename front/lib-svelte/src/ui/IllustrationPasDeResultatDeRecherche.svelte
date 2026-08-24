<script lang="ts">
  type Props = {
    largeur?: string;
    hauteur?: string;
  };

  const { largeur = '175px', hauteur = '317px' }: Props = $props();
</script>

<img
  src="/assets/images/homme-cherchant-avec-loupe.svg"
  alt="Aucun résultat"
  style:width={largeur}
  style:height={hauteur}
/>
