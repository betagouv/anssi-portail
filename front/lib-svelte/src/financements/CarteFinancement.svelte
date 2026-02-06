<script lang="ts">
  import BadgeTypeFinancement from './BadgeTypeFinancement.svelte';
  import type { ResumeFinancement } from './financement';

  export let financement: ResumeFinancement;
</script>

<a class="lien-carte" href={`/financements?idFinancement=${financement.id}`}>
  <div class="contenu">
    <div class="type-financement">
      {#each financement.typesDeFinancement as type (type)}
        <BadgeTypeFinancement>{type}</BadgeTypeFinancement>
      {/each}
    </div>
    <h6>{financement.nom}</h6>
    <div class="tags">
      {#each financement.entitesElligibles as entite (entite)}
        <lab-anssi-tag label={entite} taille="sm" type="defaut"></lab-anssi-tag>
      {/each}
    </div>
    <div class="actions">
      <div class="financeur texte-mention-xs">{financement.financeur}</div>
      <lab-anssi-icone nom="arrow-right-line" taille="sm"></lab-anssi-icone>
    </div>
  </div>
</a>

<style lang="scss">
  .lien-carte {
    display: flex;
    flex-direction: column;
    width: auto;
    .contenu {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      align-self: stretch;
      gap: 12px;
      padding: 24px;
      border: 1px solid var(--border-default-grey);
      border-radius: 8px;
      height: 100%;

      &:hover {
        background-color: var(--controle-segmente-fond-hover);
        cursor: pointer;
      }

      &:active {
        background-color: var(--controle-segmente-fond-clique);
      }

      .type-financement {
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        gap: 8px;
        align-self: stretch;
        flex-wrap: wrap;
      }

      h6 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.75rem;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        margin-top: auto;
        gap: 8px;
      }

      .actions {
        display: flex;
        align-self: stretch;
        align-items: end;
        justify-content: space-between;

        .financeur {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
