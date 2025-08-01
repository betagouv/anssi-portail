<script lang="ts">
  import { pourcentagesSerie, type Serie, totalSerie } from './Serie';

  export let serie: Serie;
  export let nomDeLaDonnee: string | undefined;
  export let montreTotaux: boolean = true;

  $: pourcentages = pourcentagesSerie(serie);

  $: pourcentagesCumules = pourcentages.reduce(
    (pourcentagesCumules, pourcentage) => [
      ...pourcentagesCumules,
      pourcentagesCumules[pourcentagesCumules.length - 1] + pourcentage,
    ],
    [0]
  );

  const rayonInterieur = 80;
  const rayonExterieur = 130;

  const pourcentageVersRadian = (p: number) =>
    (p / 100) * 2 * Math.PI - Math.PI / 2;

  const polaireVersCartesien = (r: number, theta: number) => {
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta),
    };
  };

  type Point = {
    x: number;
    y: number;
  };

  type Secteur = {
    arcLarge: boolean;
    premierPointExterieur: Point;
    secondPointExterieur: Point;
    premierPointInterieur: Point;
    secondPointInterieur: Point;
  };

  let secteurs: Secteur[] = [];

  $: {
    secteurs = [];
    for (let index = 0; index < pourcentagesCumules.length - 1; index++) {
      const angleCourant = pourcentageVersRadian(pourcentagesCumules[index]);
      let nouvelAngle = pourcentageVersRadian(pourcentagesCumules[index + 1]);
      // si on passe directement de 0 à 100, les points de départ et d'arrivée sont les mêmes
      // et svg ne dessine rien. Les prochaines lignes permettent de contourner ce problème.
      if (
        pourcentagesCumules[index] === 0 &&
        pourcentagesCumules[index + 1] === 100
      ) {
        nouvelAngle = pourcentageVersRadian(99.9999);
      }
      const pourcentageSecteur =
        pourcentagesCumules[index + 1] - pourcentagesCumules[index];
      secteurs.push({
        arcLarge: pourcentageSecteur > 50,
        premierPointExterieur: polaireVersCartesien(
          rayonExterieur,
          angleCourant
        ),
        secondPointExterieur: polaireVersCartesien(rayonExterieur, nouvelAngle),
        premierPointInterieur: polaireVersCartesien(
          rayonInterieur,
          nouvelAngle
        ),
        secondPointInterieur: polaireVersCartesien(
          rayonInterieur,
          angleCourant
        ),
      });
    }
  }
</script>

<svg id="radar" viewBox="-130 -130 260 260" xmlns="http://www.w3.org/2000/svg">
  {#if nomDeLaDonnee}
    <text class="total" x="0" y="0" text-anchor="middle" font-size="40"
      >{totalSerie(serie)}</text
    >
    <text
      class="libelle-total"
      x="0"
      y="15px"
      font-size="16"
      dominant-baseline="hanging"
      text-anchor="middle"
      >{nomDeLaDonnee}
    </text>
  {/if}
  {#each secteurs as secteur, index (index)}
    {@const valeurSerieAffichee = montreTotaux
      ? `${serie[index].valeur} (${Math.round(pourcentages[index])}%)`
      : `${Math.round(pourcentages[index])}%`}
    <path
      class={`secteur-${index} secteur`}
      d="M {secteur.premierPointExterieur.x} {secteur.premierPointExterieur.y}
         A {rayonExterieur} {rayonExterieur} 0 {secteur.arcLarge
        ? 1
        : 0} 1 {secteur.secondPointExterieur.x} {secteur.secondPointExterieur.y}
         L {secteur.premierPointInterieur.x} {secteur.premierPointInterieur.y}
         A {rayonInterieur} {rayonInterieur} 0 {secteur.arcLarge
        ? 1
        : 0} 0 {secteur.secondPointInterieur.x} {secteur.secondPointInterieur.y}
         Z"
      ><title>{`${serie[index].libelle} : ${valeurSerieAffichee}`}</title></path
    >
  {/each}
</svg>

<style lang="scss">
  @use '../../../assets/styles/responsive' as *;
  .total {
    font-weight: bold;
  }

  svg {
    width: 240px;
    height: 240px;

    @include a-partir-de(sm) {
      width: 260px;
      height: 260px;
    }
  }

  .secteur {
    stroke: white;
    stroke-width: 3px;
  }

  .secteur:hover {
    opacity: 80%;
  }

  .secteur-0 {
    fill: #6369f1;
  }

  .secteur-1 {
    fill: #fec54b;
  }

  .secteur-2 {
    fill: #8248a1;
  }

  .secteur-3 {
    fill: #f26c85;
  }

  .secteur-4 {
    fill: #8ed4a3;
  }
</style>
