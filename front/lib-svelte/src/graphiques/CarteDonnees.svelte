<script lang="ts">
  import type { Snippet } from 'svelte';

  import { enPropriétéWebC } from '@plateforme/webComponent';
  import Bouton from '../ui/Bouton.svelte';

  export interface TableauDeDonnees {
    colonnes: Array<string>;
    lignes: Array<Array<string | number>>;
  }

  interface Props {
    id: string;
    titre: string;
    description?: string;
    infobulle?: string;
    source: string;
    date?: string;
    tableau?: TableauDeDonnees;
    réglages?: Snippet;
    children: Snippet;
  }

  let { id, titre, description, infobulle, source, date, tableau, réglages, children }: Props = $props();

  let vue: 'graphique' | 'tableau' = $state('graphique');

  const colonnes = $derived((tableau?.colonnes ?? []).map((label, index) => ({ key: `colonne-${index}`, label })));
  const lignes = $derived(
    (tableau?.lignes ?? []).map((ligne) =>
      Object.fromEntries(ligne.map((cellule, index) => [`colonne-${index}`, cellule]))
    )
  );
</script>

<article class="carte-donnees">
  <header>
    <h4>{titre}</h4>
    {#if infobulle}
      <dsfr-tooltip id="infobulle-{id}" content={infobulle} type="hover">
        <Bouton
          libelle="Informations complémentaires sur {titre}"
          type="tertiaire-sans-bordure"
          taille="sm"
          icone="question-line"
          iconeSeule
        ></Bouton>
      </dsfr-tooltip>
    {/if}
  </header>
  {#if description}
    <p class="description">{description}</p>
  {/if}
  {#if réglages}
    <div class="reglages">
      {@render réglages()}
    </div>
  {/if}
  <div class="contenu">
    {#if tableau && vue === 'tableau'}
      <dsfr-table
        id="tableau-{id}"
        caption={titre}
        no-caption
        columns={enPropriétéWebC(colonnes)}
        rows={enPropriétéWebC(lignes)}
      ></dsfr-table>
    {:else}
      {@render children()}
    {/if}
  </div>
  <footer>
    <p>{date ? `${source}, ${date}` : source}</p>
    {#if tableau}
      <div class="choix-vue" role="group" aria-label="Choisir la vue">
        <button
          type="button"
          title="Vue graphique"
          aria-label="Vue graphique"
          aria-pressed={vue === 'graphique'}
          onclick={() => (vue = 'graphique')}
        >
          <lab-anssi-icone nom="pie-chart-2-fill" taille="sm"></lab-anssi-icone>
        </button>
        <button
          type="button"
          title="Vue tableau"
          aria-label="Vue tableau"
          aria-pressed={vue === 'tableau'}
          onclick={() => (vue = 'tableau')}
        >
          <lab-anssi-icone nom="table-line" taille="sm"></lab-anssi-icone>
        </button>
      </div>
    {/if}
  </footer>
</article>

<style lang="scss">
  .carte-donnees {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
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

    .description {
      color: var(--text-default-grey);
      font-size: 0.75rem;
      line-height: 1.25rem;
      margin: 0;
    }

    .reglages {
      overflow-x: auto;
    }

    .contenu {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-height: 2rem;

      p {
        flex: 1;
        color: var(--text-default-grey);
        font-size: 0.75rem;
        line-height: 1.25rem;
        margin: 0;
      }
    }

    .choix-vue {
      display: flex;
      border: 1px solid var(--border-default-grey);
      border-radius: 4px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: -1px;
        padding: 0.5rem 0.75rem;
        border: 1px solid transparent;
        border-radius: 4px;
        background: none;
        color: var(--text-title-grey);
        cursor: pointer;

        &[aria-pressed='true'] {
          border-color: var(--border-active-blue-france);
          color: var(--text-active-blue-france);
        }

        &:focus-visible {
          outline: 2px solid var(--focus-color, #0a76f6);
          outline-offset: 2px;
        }
      }
    }
  }
</style>
