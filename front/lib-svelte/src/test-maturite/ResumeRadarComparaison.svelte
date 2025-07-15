<script lang="ts">
  import { type IdNiveau, niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import type { SerieRadar } from './Serie';
  import { type IdRubrique, rubriques } from './TestMaturite.donnees';

  export let series: SerieRadar[];
  export let actif: IdNiveau |undefined = undefined;

  const rubriquesTrieesParLettre = rubriques.toSorted((a, b) =>
    a.lettre > b.lettre ? 1 : -1
  );

  const valeur = (idNiveau: string, idRubrique: IdRubrique) => {
    const serie = series.find((serie) => serie.id === idNiveau);
    if (!serie) return 0;
    return serie.valeurs[idRubrique];
  };
</script>

<div class="legende">
  {#each niveauxMaturite as niveau (niveau.id)}
    <div class="ligne-legende ligne-legende-{niveau.id}" class:actif={actif === niveau.id}>
      <span class="libelle">{niveau.label}</span>
    </div>
  {/each}
</div>

<div class="accordeon">
  {#each niveauxMaturite as niveau (niveau.id)}
    <details>
      <summary>
        <span class:actif={actif === niveau.id}>
          <span class="pastille ligne-legende-{niveau.id}"></span>
          {niveau.label}
        </span>
      </summary>
      <ol>
        {#each rubriquesTrieesParLettre as rubrique (rubrique.id)}
          <li>
            <span class="lettre">{rubrique.lettre}</span> - {rubrique.label} - {valeur(
              niveau.id,
              rubrique.id
            )}/5
          </li>
        {/each}
      </ol>
    </details>
  {/each}
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .legende {
    display: none;
    flex-direction: row;
    gap: 24px;
    justify-content: space-between;
    padding: 24px;
    @include a-partir-de(sm) {
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
    @include a-partir-de(sm) {
      display: none;
    }

    details {
      border-bottom: 1px solid #ddd;

      &:first-of-type {
        border-top: 1px solid #ddd;
      }

      &[open] summary::after {
        transform: rotate(-180deg);
      }

      &[open] summary {
        background-color: #fcf1cf;
      }

      summary {
        padding: 12px 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        cursor: pointer;

        &>span {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 8px;

          &.actif{
            outline: 2px solid #fed980;
            outline-offset: 6px;
            border-radius: 2px;
          }
        }

        .pastille {
          width: 14px;
          height: 14px;
          border-radius: 7px;
          content: '';
          background-color: var(--couleur-puce);
        }

        &::marker {
          content: '';
        }

        &::-webkit-details-marker {
          display: none;
        }

        &:after {
          content: '';
          display: block;
          width: 16px;
          height: 16px;
          background: url('/assets/images/icone-chevron-bas.svg');
          transition: transform 0.3s linear;
          margin-left: auto;
        }
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
  }
</style>
