<script lang="ts">
  import { profilStore } from '../stores/profil.store.js';
  import type { Branche } from './filAriane';

  export let feuille: string;
  export let branche: undefined | Branche = undefined;
  export let brancheConnectee: undefined | Branche = undefined;
  export let fondSombre = false;
</script>

<div class="fil-ariane {fondSombre ? 'fond-sombre' : ''}">
  {#if $profilStore}
    <a href="/catalogue" class="lien">Catalogue des services</a>
  {:else}
    <a href="/" class="lien">Accueil</a>
  {/if}
  <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /> </span>

  {#if branche && !$profilStore}
    {#if branche.lien}
      <a href={branche.lien} class="lien">{branche.nom}</a>
    {:else}
      {branche.nom}
    {/if}
    <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  {/if}

  {#if brancheConnectee && $profilStore}
    {#if brancheConnectee.lien}
      <a href={brancheConnectee.lien} class="lien">{brancheConnectee.nom}</a>
    {:else}
      {brancheConnectee.nom}
    {/if}
    <span><img src="/assets/images/icone-chevron-droite.svg" alt="" /></span>
  {/if}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <span>{@html feuille}</span>
</div>

<style>
  .fil-ariane {
    grid-area: ariane;

    &.fond-sombre {
      a {
        color: #ffffff;
        text-decoration-color: #ffffff;
      }

      img {
        filter: invert(1);
      }
    }
  }
</style>
