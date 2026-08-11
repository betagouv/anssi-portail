<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';

  type Props = {
    largeur?: string;
    hauteur?: string;
  };

  const { largeur = '175px', hauteur = '317px' }: Props = $props();
</script>

{#if afficheNouvelleDA}
  <img
    src="/assets/images/homme-cherchant-avec-loupe-nouvelle-da.svg"
    alt="Aucun résultat"
    style:width={largeur}
    style:height={hauteur}
  />
{:else}
  <img
    src="/assets/images/homme-cherchant-avec-loupe.svg"
    alt="Aucun résultat"
    style:width={largeur}
    style:height={hauteur}
  />
{/if}
