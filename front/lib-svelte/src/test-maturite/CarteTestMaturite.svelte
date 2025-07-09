<script context="module" lang="ts">
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.donnees';

  export type ResultatTest = {
    dateRealisation: string;
    niveau: IdNiveau;
    id: string;
  };
</script>

<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';

  export let resultatTest: ResultatTest;

  $: niveau = niveauxMaturite.find(
    (niveau) => niveau.id === resultatTest.niveau,
  );

  $: description = niveau?.description;
  $: libelleNiveau = niveau?.label;
  $: dateFormatee = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(resultatTest.dateRealisation));
</script>

<a href="#" class="carte">
  <span class="date">{dateFormatee}</span>
  <h3>{libelleNiveau}</h3>
  <p class="description">{description}</p>
  <p class="lien">
    Accéder au détail
    <lab-anssi-icone nom="arrow-right-line"></lab-anssi-icone>
  </p>
</a>

<style lang="scss">
  .carte {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    background: white;

    &:hover {
      background: #f6f6f6;
    }

    &:active {
      background: #ededed;
    }

    &:focus {
      outline: 2px solid #0a76f6;
      outline-offset: 2px;
    }
  }

  .date {
    color: #666;
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin-bottom: 8px;
  }

  h3 {
    color: #161616;
    font-size: 1.125rem;
    font-weight: bold;
    line-height: 1.5rem;
    margin-bottom: 4px;
  }

  .description {
    color: #3a3a3a;
    margin: 0 0 8px;
    text-align: left;
  }

  .lien {
    align-self: flex-end;
  }
</style>
