<script context="module" lang="ts">
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import type { ReponsesResultatTest } from './ResultatsTest.type';
  export type ResultatTest = {
    dateRealisation: string;
    niveau: IdNiveau;
    id: string;
    reponses: ReponsesResultatTest;
  };
</script>

<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';

  export let resultatTest: ResultatTest;

  $: niveau = niveauxMaturite.find(
    (niveau) => niveau.id === resultatTest.niveau
  );

  $: description = niveau?.description;
  $: libelleNiveau = niveau?.label;
  $: dateFormatee = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
  }).format(new Date(resultatTest.dateRealisation));
</script>

<a href="#historique/{resultatTest.id}" class="carte">
  <div class="illustration-niveau">
    <img
      class="plante"
      src="/assets/images/test-maturite/niveaux/{resultatTest.niveau}.svg"
      alt="Niveau de maturité"
    />
  </div>
  <span class="date">{dateFormatee}</span>
  <h3>{libelleNiveau}</h3>
  <p class="description">{description}</p>
  <p class="lien">
    Accéder au détail
    <lab-anssi-icone nom="arrow-right-line"></lab-anssi-icone>
  </p>
</a>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .carte {
    padding: 24px;
    display: grid;
    grid-template-areas:
      'illustration date'
      'illustration niveau'
      'illustration description'
      'illustration lien';
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    background: white;

    @include a-partir-de(md) {
      padding: 12px;
      gap: 0 24px;
    }

    &:hover {
      background: #f6f6f6;
    }

    &:active {
      background: #ededed;
    }

    &:focus {
      outline: 2px solid var(--bleu-contour-mis-en-valeur);
      outline-offset: 2px;
    }
  }

  .illustration-niveau {
    grid-area: illustration;
    display: none;
    @include a-partir-de(md) {
      background-color: #fff7db;
      width: 120px;
      height: 176px;
      display: flex;
      flex-direction: column-reverse;
      padding-bottom: 16px;
      align-items: center;
      position: relative;
      img {
        transform: scale(55%);
        transform-origin: bottom center;
        z-index: 1;
      }

      &:before {
        content: '';
        position: absolute;
        z-index: 0;
        bottom: 26px;
        border: 1px solid #0d0c21;
        left: 0;
        right: 0;
      }
    }
  }

  .date {
    grid-area: date;
    color: #666;
    font-size: 0.875rem;
    line-height: 1.5rem;
    margin-bottom: 8px;
    @include a-partir-de(md) {
      margin-top: 12px;
    }
  }

  h3 {
    grid-area: niveau;
    color: #161616;
    font-size: 1.125rem;
    font-weight: bold;
    line-height: 1.5rem;
    margin-bottom: 4px;
  }

  .description {
    grid-area: description;
    color: #3a3a3a;
    margin: 0 0 8px;
    text-align: left;
  }

  .lien {
    grid-area: lien;
    justify-self: flex-end;
    @include a-partir-de(md) {
      margin-bottom: 12px;
    }
  }

  @include a-partir-de(md) {
    .date,
    h3,
    .description,
    .lien {
      margin-right: 12px;
    }
  }
</style>
