export function ratioEspaceOccupe({ top, hauteur, hauteurFenetre }) {
  if (top < 0 && hauteur + top < 0) return 0;
  if (top > hauteurFenetre) return 0;
  const hauteurVisible = hauteur - Math.abs(top);
  return Math.min(hauteurVisible, hauteurFenetre) / hauteurFenetre;
}
