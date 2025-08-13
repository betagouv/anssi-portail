<script lang="ts">
  export let nom: string;
  export let typesDeFinancement: string[];
  export let entitesElligible: string[];
  export let financeur: string;
</script>

<div class="contenu">
  <div class="type-financement">
    {#each typesDeFinancement as type (type)}
      <lab-anssi-tag label={type} taille="sm" type="defaut"></lab-anssi-tag>
    {/each}
  </div>
  <h6>{nom}</h6>
  <div class="tags">
    {#each entitesElligible as entite (entite)}
      <lab-anssi-tag label={entite} taille="sm" type="defaut"></lab-anssi-tag>
    {/each}
  </div>
  <div class="actions">
    <div class="financeur">{financeur}</div>
    <lab-anssi-icone nom="arrow-right-line" taille="sm"></lab-anssi-icone>
  </div>
</div>

<style lang="scss">
  .contenu {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid var(--gris-clair);

    &:hover {
      background-color: var(--controle-segmente-fond-hover);
      cursor: pointer;
    }

    &:active {
      background-color: var(--controle-segmente-fond-clique);
    }

    h6 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.75rem;
    }

    .tags {
      display: flex;
      margin-top: auto;
      gap: 8px;
    }

    .actions {
      display: flex;
      align-self: stretch;
      align-items: end;
      justify-content: space-between;

      .financeur {
        color: #666;
        font-size: 0.75rem;
        line-height: 1.25rem;
      }
    }
  }
</style>
