<script lang="ts">
  import type { Rubrique } from './TestMaturite.donnees';
  import type { SerieRadar } from './Serie';

  export let rubriques: Rubrique[] = [
    {
      id: 'pilotage',
      label: 'Pilotage de la sécurité',
      ancrageTexte: 'start',
      alignementVertical: 'middle',
      lettre: 'C',
    },
    {
      id: 'budget',
      label: 'Budget',
      ancrageTexte: 'start',
      alignementVertical: 'hanging',
      lettre: 'D',
    },
    {
      id: 'ressources-humaines',
      label: 'Ressources humaines',
      ancrageTexte: 'end',
      alignementVertical: 'hanging',
      lettre: 'E',
    },
    {
      id: 'adoption-solutions',
      label: 'Adoption des solutions cyber',
      ancrageTexte: 'end',
      alignementVertical: 'middle',
      lettre: 'F',
    },
    {
      id: 'prise-en-compte-risque',
      label: 'Prise en compte du risque',
      ancrageTexte: 'end',
      alignementVertical: 'auto',
      lettre: 'A',
    },
    {
      id: 'posture',
      label: "Posture à l'égard de la cyber",
      ancrageTexte: 'start',
      alignementVertical: 'auto',
      lettre: 'B',
    },
  ];
  export let series: SerieRadar[];

  const tailleRadar = 200;
  const polaireVersCartesien = (r: number, theta: number) => ({
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  });
  type Point = { x: number; y: number };

  const pointsEnChaineSvg = (coordonnees: Point[] ) => {
    return coordonnees.map((c) => `${c.x},${c.y}`).join(' ');
  };

  const pointsDuPolygoneDeLaSerie = (serie: SerieRadar) : Point[] => {
    return new Array(6).fill(0).map((_, index) => {
      const valeur = serie?.valeurs[rubriques[index].id];
      const r = ((valeur || 0) / 5) * tailleRadar;
      const theta = (index * 2 * Math.PI) / 6;
      return polaireVersCartesien(r, theta);
    });
  };

  let coefDistanceLibelle: number = 1.1;
</script>

<div class="radar">
  <svg
    id="radar"
    viewBox="-600 -225 1200 450"
    xmlns="http://www.w3.org/2000/svg"
  >
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
      <polygon
        points={pointsEnChaineSvg(pointsDuPolygoneDeLaSerie(serie))}
        fill-opacity="0"
        stroke={serie.couleur}
        stroke-width="3"
      />
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
          font-size="15"
          stroke="white"
          stroke-width="0.6"
          font-weight="bold"
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
        <tspan>{rubrique.label}</tspan>
      </text>
    {/each}
  </svg>
</div>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;

  .radar {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    #radar {
      max-height: 350px;

      .libelle-long {
        font-size: 1.375rem;
      }
    }
  }
</style>
