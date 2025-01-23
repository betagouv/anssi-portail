<script lang="ts">
  import type { IdRubrique, Rubrique } from "./TestMaturite.donnees";

  export let resultats: Record<IdRubrique, number>;
  export let rubriques: Rubrique[] = [
    {
      id: "pilotage",
      label: "Pilotage de la sécurité",
      ancrageTexte: "start",
      alignementVertical: "middle",
      lettre: "A",
    },
    {
      id: "budget",
      label: "Budget",
      ancrageTexte: "start",
      alignementVertical: "hanging",
      lettre: "B",
    },
    {
      id: "ressources-humaines",
      label: "Ressources humaines",
      ancrageTexte: "end",
      alignementVertical: "hanging",
      lettre: "C",
    },
    {
      id: "adoption-solutions",
      label: "Adoption des solutions cyber",
      ancrageTexte: "end",
      alignementVertical: "middle",
      lettre: "D",
    },
    {
      id: "prise-en-compte-risque",
      label: "Prise en compte du risque",
      ancrageTexte: "end",
      alignementVertical: "auto",
      lettre: "E",
    },
    {
      id: "posture",
      label: "Posture à l'égard de la cyber",
      ancrageTexte: "start",
      alignementVertical: "auto",
      lettre: "F",
    },
  ];

  const tailleRadar = 200;
  const polaireVersCartesien = (r: number, theta: number) => ({
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  });
  type Point = { x: number; y: number };

  const tableauEnPointsPolygone = (coordonnees: Point[]) =>
    coordonnees.map((c) => `${c.x},${c.y}`).join(" ");

  $: pointsDuPolygone = new Array(6).fill(0).map((_, index) => {
    const valeur = resultats[rubriques[index].id];
    const r = (valeur / 5) * tailleRadar;
    const theta = (index * 2 * Math.PI) / 6;
    return polaireVersCartesien(r, theta);
  });

  let viewBox: string;
  let coefDistanceLibelle: number;

  function modifieViewBox() {
    const estPetitEcran = window.matchMedia("(max-width: 576px)").matches;

    if (estPetitEcran) {
      viewBox = "-220 -220 440 440";
      coefDistanceLibelle = 1.03;
    } else {
      viewBox = "-440 -225 880 450";
      coefDistanceLibelle = 1.1;
    }
  }

  modifieViewBox();

  window
    .matchMedia("(max-width: 576px)")
    .addEventListener("change", modifieViewBox);
</script>

<div class="radar-maturite">
  <svg id="radar" {viewBox} xmlns="http://www.w3.org/2000/svg">
    {#each new Array(6).fill(0).map((_, index) => index) as index}
      {@const theta = (index * 2 * Math.PI) / 6}
      {@const coordonnees = polaireVersCartesien(tailleRadar, theta)}
      <line x1="0" y1="0" x2={coordonnees.x} y2={coordonnees.y} stroke="#ddd" />
      {#each new Array(6).fill(0).map((_, index) => index) as index2}
        {@const thetaSuivant = ((index + 1) * 2 * Math.PI) / 6}
        {@const decalage = (tailleRadar / 5) * index2}
        {@const coordonneesActuelles = polaireVersCartesien(decalage, theta)}
        {@const coordonneesSuivantes = polaireVersCartesien(
          decalage,
          thetaSuivant,
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
    {#each new Array(6).fill(0).map((_, index) => index) as index}
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

    {#each rubriques as rubrique, index}
      {@const coordonnees = polaireVersCartesien(
        tailleRadar * coefDistanceLibelle,
        (index * 2 * Math.PI) / 6,
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
    {#each rubriques as rubrique}
      <li>
        <span class="lettre">{rubrique.lettre}</span> : {rubrique.label} -
        {resultats[rubrique.id]}/5
      </li>
    {/each}
  </ul>
</div>
