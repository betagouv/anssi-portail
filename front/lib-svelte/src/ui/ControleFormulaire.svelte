<script lang="ts">
  export let libelle: string;
  export let sousTitre: string = '';
  export let requis: boolean = false;
</script>

<label class="controle-formulaire">
  <span class:requis>{libelle}</span>
  {#if sousTitre}<span class="sousTitre">{sousTitre}</span>{/if}
  <span class="contenu">
    <slot />
  </span>
</label>

