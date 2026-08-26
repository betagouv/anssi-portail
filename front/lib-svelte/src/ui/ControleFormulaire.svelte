<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    libelle: string;
    sousTitre?: string;
    requis?: boolean;
    children?: Snippet;
  }

  let { libelle, sousTitre = '', requis = false, children }: Props = $props();
</script>

<label class="controle-formulaire">
  <span class:requis>{libelle}</span>
  {#if sousTitre}<span class="sousTitre">{sousTitre}</span>{/if}
  <span class="contenu">
    {@render children?.()}
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
      color: var(--text-default-error);
      margin-right: 4px;
      font-size: 1rem;
    }
  }
</style>
