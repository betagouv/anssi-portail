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

<style lang="scss">
  .controle-formulaire {
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: normal;

    .contenu {
      margin-top: 4px;
    }

    .sousTitre {
      color: var(--texte-clair);
      font-size: 0.75rem;
      line-height: 1.25rem;
    }

    .requis:before {
      content: '*';
      color: #e3271c;
      margin-right: 4px;
      font-size: 1rem;
    }
  }
</style>
