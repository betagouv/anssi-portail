<script lang="ts">
  import { niveauxMaturite } from '../niveaux-maturite/NiveauxMaturite.donnees';
  import { arrondisAuCentieme } from '../utils/arrondis';
  import type { SerieRadar } from './Serie';
  import { rubriques } from './TestMaturite.donnees';

  export let series: SerieRadar[];
  export let affichageReduit: boolean = false;

  const tailleRadar = 200;
  const polaireVersCartesien = (r: number, theta: number) => ({
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  });
  type Point = { x: number; y: number };

  const cheminSvg = (coordonnees: Point[]) => {
    return 'M ' + coordonnees.map((c) => `${c.x} ${c.y}`).join(' L ') + ' Z';
  };

  const pointsDuPolygoneDeLaSerie = (serie: SerieRadar): Point[] => {
    return new Array(6).fill(0).map((_, index) => {
      const valeur = serie?.valeurs[rubriques[index].id];
      const r = ((valeur || 0) / 5) * tailleRadar;
      const theta = (index * 2 * Math.PI) / 6;
      return polaireVersCartesien(r, theta);
    });
  };

  const libelleSerie = (serie: SerieRadar) =>
    niveauxMaturite.find((niveau) => niveau.id === serie.id)?.label;

  let coefDistanceLibelle: number = 1.1;
  let viewBox: string;
  let estPetitEcran: boolean = false;

  function modifieViewBox() {
    estPetitEcran = window.matchMedia('(max-width: 576px)').matches;

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

<div class="radar">
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

    {#each series as serie (serie.id)}
      {@const pointsDuPolygone = pointsDuPolygoneDeLaSerie(serie)}
      <path
        class="serie"
        fill="none"
        fill-opacity="0"
        stroke={serie.couleur}
        stroke-width="3"
        d={cheminSvg(pointsDuPolygone)}
      >
        <title>{libelleSerie(serie)}</title>
      </path>
      {#each pointsDuPolygone as point, index (index)}
        <circle
          class="sommet"
          r="8"
          cx={point.x}
          cy={point.y}
          fill={serie.couleur}
          stroke="white"
          stroke-width="3px"
        >
          <title
            >{`${libelleSerie(serie)} / ${rubriques[index].label} : ${arrondisAuCentieme(serie.valeurs[rubriques[index].id])}`}</title
          >
        </circle>
      {/each}
    {/each}

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
      {#if affichageReduit && estPetitEcran}
        <text
          x={coordonnees.x}
          y={coordonnees.y}
          text-anchor={rubrique.ancrageTexte}
          dominant-baseline={rubrique.alignementVertical}
          font-size="16"
          fill="#0D0C21"
          class="libelle-lettre"
        >
          {rubrique.lettre}
        </text>
      {:else}
        <text
          x={coordonnees.x}
          y={coordonnees.y}
          text-anchor={rubrique.ancrageTexte}
          dominant-baseline={rubrique.alignementVertical}
          font-size="12"
          fill="#0D0C21"
          class="libelle-long"
        >
          <tspan>{rubrique.label}</tspan>
        </text>
      {/if}
    {/each}
  </svg>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .serie:hover {
    stroke-width: 5;
  }

  .sommet {
    fill-opacity: 0;
    stroke-width: 0;
  }
  .sommet:hover {
    fill-opacity: 1;
    stroke-width: 3px;
  }
  .radar {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    #radar {
      max-height: 350px;

      .libelle-long {
        @include a-partir-de(sm) {
          font-size: 1.375rem;
        }
      }

      .libelle-lettre {
        font-weight: bold;
      }
    }
  }
</style>
