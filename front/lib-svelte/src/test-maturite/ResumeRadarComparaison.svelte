<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { IdNiveau } from '../niveaux-maturite/NiveauxMaturite.type';
  import SectionAccordeon from '../ui/SectionAccordeon.svelte';
  import { arrondisAuCentieme } from '../utils/arrondis';
  import type { SerieRadar } from './Serie';
  import { rubriques } from './TestMaturite.donnees';
  import type { IdRubrique } from './TestMaturite.type';

  export let series: SerieRadar[];
  export let actif: IdNiveau | undefined = undefined;

  const rubriquesTrieesParLettre = rubriques.toSorted((a, b) =>
    a.lettre > b.lettre ? 1 : -1
  );

  const valeur = (idNiveau: string, idRubrique: IdRubrique) => {
    const serie = series.find((serie) => serie.id === idNiveau);
    if (!serie) return 0;
    return arrondisAuCentieme(serie.valeurs[idRubrique]);
  };
</script>

<div class="legende">
  {#each niveauxMaturite as niveau (niveau.id)}
    <div
      class="ligne-legende ligne-legende-{niveau.id}"
      class:actif={actif === niveau.id}
    >
      <span class="libelle">{niveau.label}</span>
    </div>
  {/each}
</div>

<div class="accordeon">
  {#each niveauxMaturite as niveau (niveau.id)}
    <SectionAccordeon>
      <span slot="titre" class:actif={actif === niveau.id}>
        <span class="pastille ligne-legende-{niveau.id}"></span>
        {niveau.label}
      </span>
      <ol slot="corps">
        {#each rubriquesTrieesParLettre as rubrique (rubrique.id)}
          <li>
            <span class="lettre">{rubrique.lettre}</span> - {rubrique.label} - {valeur(
              niveau.id,
              rubrique.id
            )}/5
          </li>
        {/each}
      </ol>
    </SectionAccordeon>
  {/each}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .legende {
    display: none;
    flex-direction: row;
    gap: 24px;
    justify-content: center;
    padding: 24px;
    @include a-partir-de(md) {
      display: flex;
    }
  }

  .ligne-legende {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 0 8px;

    &.actif {
      outline: 2px solid #fed980;
      outline-offset: 6px;
      border-radius: 2px;
    }
  }

  .ligne-legende:before {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    content: '';
    background-color: var(--couleur-puce);
  }

  .ligne-legende-insuffisant {
    --couleur-puce: #6369f1;
  }

  .ligne-legende-emergent {
    --couleur-puce: #fec54b;
  }

  .ligne-legende-intermediaire {
    --couleur-puce: #8248a1;
  }

  .ligne-legende-confirme {
    --couleur-puce: #f26c85;
  }

  .ligne-legende-optimal {
    --couleur-puce: #8ed4a3;
  }

  .accordeon {
    @include a-partir-de(md) {
      display: none;
    }

    .actif {
      outline: 2px solid #fed980;
      outline-offset: 6px;
      border-radius: 2px;
    }

    ol {
      padding: 0;
      margin: 16px;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      .lettre {
        font-weight: bold;
      }
    }
  }
</style>
