<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    titre: string;
    infobulle?: string;
    source: string;
    date: string;
    children: Snippet;
  }

  let { id, titre, infobulle, source, date, children }: Props = $props();
</script>

<article class="carte-donnees">
  <header>
    <h4>{titre}</h4>
    {#if infobulle}
      <dsfr-tooltip id="infobulle-{id}" content={infobulle} type="hover">
        <dsfr-button
          label="Informations complémentaires sur {titre}"
          kind="tertiary-no-outline"
          size="sm"
          has-icon
          icon="question-line"
          icon-place="only"
        ></dsfr-button>
      </dsfr-tooltip>
    {/if}
  </header>
  <div class="contenu">
    {@render children()}
  </div>
  <footer>
    <p>{source}, {date}</p>
  </footer>
</article>

<style lang="scss">
  .carte-donnees {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    padding: 1.5rem;
    box-sizing: border-box;
    background: var(--background-default-grey);
    box-shadow: 0 2px 3px var(--shadow-color);

    header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;

      h4 {
        flex: 1;
        color: var(--text-title-grey);
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-weight: bold;
        margin: 0;
      }
    }

    .contenu {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    footer p {
      color: var(--text-default-grey);
      font-size: 0.75rem;
      line-height: 1.25rem;
      margin: 0;
    }
  }
</style>
