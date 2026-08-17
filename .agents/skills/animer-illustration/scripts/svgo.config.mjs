// Configuration SVGO des illustrations animées.
// Chaque désactivation corrige un dégât constaté, ne pas les retirer sans mesurer.
export default {
  multipass: true,
  // Une balise par ligne : prettier préserve ensuite ce format.
  js2svg: { indent: 2, pretty: true },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Les ids pattern/filter/paint sont référencés par url(#...).
          cleanupIds: false,
          // Écraserait le groupe qui isole le filtre du nœud animé (tremblement).
          collapseGroups: false,
          // Fusionnerait des tracés voisins : le motif de tirets repart à chaque
          // sous-chemin, l'animation se jouerait en morceaux.
          mergePaths: false,
          convertPathData: { floatPrecision: 2 },
          cleanupNumericValues: { floatPrecision: 2 },
          // Le cadrage des photos vient d'une matrice à très petits coefficients :
          // l'arrondi par défaut décale l'image de plusieurs pixels.
          convertTransform: { floatPrecision: 8, transformPrecision: 8 },
        },
      },
    },
  ],
};
