/**
 * Copie un texte dans le presse-papier sans jamais lever d'exception.
 * `navigator.clipboard.writeText` est rejetée quand le document n'a pas le focus
 * (modale en cours de fermeture, outils de développement, iframe…) : dans ce cas on indique que ça n’a pas fonctionné.
 * @returns `true` si la copie a réussi.
 */
export const copieDansLePressePapier = async (texte: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
};
