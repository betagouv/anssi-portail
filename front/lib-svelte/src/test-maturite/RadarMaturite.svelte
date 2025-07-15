<script lang="ts">
  import { type IdRubrique, rubriques } from './TestMaturite.donnees';

  export let resultats: Record<IdRubrique, number | null>;

  const rubriquesTrieesParLettre = rubriques.toSorted((a, b) =>
    a.lettre > b.lettre ? 1 : -1
  );

  const tailleRadar = 200;
  const polaireVersCartesien = (r: number, theta: number) => ({
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  });
  type Point = { x: number; y: number };

  const tableauEnPointsPolygone = (coordonnees: Point[]) =>
    coordonnees.map((c) => `${c.x},${c.y}`).join(' ');

  $: pointsDuPolygone = new Array(6).fill(0).map((_, index) => {
    const valeur = resultats[rubriques[index].id];
    const r = ((valeur || 0) / 5) * tailleRadar;
    const theta = (index * 2 * Math.PI) / 6;
    return polaireVersCartesien(r, theta);
  });

  let viewBox: string;
  let coefDistanceLibelle: number;

  function modifieViewBox() {
    const estPetitEcran = window.matchMedia('(max-width: 576px)').matches;

    if (estPetitEcran) {
      viewBox = '-220 -220 440 440';
      coefDistanceLibelle = 1.03;
    } else {
      viewBox = '-600 -225 1200 450';
      coefDistanceLibelle = 1.1;
    }
  }

  modifieViewBox();

  window
    .matchMedia('(max-width: 576px)')
    .addEventListener('change', modifieViewBox);
</script>

<div class="radar-maturite">
  <svg id="radar" {viewBox} xmlns="http://www.w3.org/2000/svg">
    {#each new Array(6).fill(0).map((_, index) => index) as index (index)}
      {@const theta = (index * 2 * Math.PI) / 6}
      {@const coordonnees = polaireVersCartesien(tailleRadar, theta)}
      <line x1="0" y1="0" x2={coordonnees.x} y2={coordonnees.y} stroke="#ddd" />
      {#each new Array(6).fill(0).map((_, index) => index) as index2 (index2)}
        {@const theta = (index * 2 * Math.PI) / 6}
        {@const thetaSuivant = ((index + 1) * 2 * Math.PI) / 6}
        {@const decalage = (tailleRadar / 5) * index2}
        {@const coordonneesActuelles = polaireVersCartesien(decalage, theta)}
        {@const coordonneesSuivantes = polaireVersCartesien(
          decalage,
          thetaSuivant
        )}
        <line
          x1={coordonneesActuelles.x}
          y1={coordonneesActuelles.y}
          x2={coordonneesSuivantes.x}
          y2={coordonneesSuivantes.y}
          stroke="#ddd"
        />
      {/each}
    {/each}

    <polygon
      points={tableauEnPointsPolygone(pointsDuPolygone)}
      fill="#FED98099"
      stroke="#0D0C21"
      stroke-width="3"
    />
    {#each new Array(6).fill(0).map((_, index) => index) as index (index)}
      {#if index !== 0}
        {@const r = (tailleRadar / 5) * index}
        {@const y = -r * Math.cos(-Math.PI / 6)}
        <text
          x="0"
          {y}
          fill="#0D0C21"
          text-anchor="middle"
          font-size="22"
          stroke="white"
          stroke-width="1.3"
          font-weight="bolder"
          dominant-baseline="middle"
        >
          {index}
        </text>
      {/if}
    {/each}

    {#each rubriques as rubrique, index (rubrique.id)}
      {@const coordonnees = polaireVersCartesien(
        tailleRadar * coefDistanceLibelle,
        (index * 2 * Math.PI) / 6
      )}
      <text
        x={coordonnees.x}
        y={coordonnees.y}
        text-anchor={rubrique.ancrageTexte}
        dominant-baseline={rubrique.alignementVertical}
        font-size="12"
        fill="#0D0C21"
        class="libelle-long"
      >
        <tspan>{rubrique.label} -</tspan>
        <tspan font-weight="bold">{resultats[rubrique.id]}/5</tspan>
      </text>
      <text
        x={coordonnees.x}
        y={coordonnees.y}
        text-anchor={rubrique.ancrageTexte}
        dominant-baseline={rubrique.alignementVertical}
        font-size="16"
        fill="#0D0C21"
        class="libelle-lettre">{rubrique.lettre}</text
      >
    {/each}
  </svg>

  <ul>
    {#each rubriquesTrieesParLettre as rubrique (rubrique.id)}
      <li>
        <span class="lettre">{rubrique.lettre}</span> : {rubrique.label} -
        {resultats[rubrique.id]}/5
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .radar-maturite {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    #radar {
      max-height: 350px;

      .libelle-long {
        display: none;

        @include a-partir-de(sm) {
          display: block;
          font-size: 1.375rem;
        }
      }

      .libelle-lettre {
        font-weight: bold;
        @include a-partir-de(sm) {
          display: none;
        }
      }
    }

    ul {
      align-self: flex-start;
      list-style-type: none;
      padding: 0;
      margin: 0;

      @include a-partir-de(sm) {
        display: none;
      }

      li {
        padding: 8px;
        margin: 0;

        .lettre {
          font-weight: bold;
        }
      }
    }
  }
</style>
