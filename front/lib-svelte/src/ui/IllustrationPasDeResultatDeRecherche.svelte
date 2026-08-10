<script lang="ts">
  import { afficheNouvelleDA } from '$plateforme/environnement';
</script>

{#if afficheNouvelleDA}
  <img src="/assets/images/homme-cherchant-avec-loupe-nouvelle-da.svg" width="175" height="317" alt="Aucun résultat" />
{:else}
  <img src="/assets/images/homme-cherchant-avec-loupe.svg" width="175" height="317" alt="Aucun résultat" />
{/if}
