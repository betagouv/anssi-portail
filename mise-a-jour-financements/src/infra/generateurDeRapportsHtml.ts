import { diffWords } from 'diff';
import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';

export class GenerateurDeRapportsHtml implements GenerateurDeRapports {
  constructor(private readonly sortie: (ligne: string) => void) {}

  async genereRapportDifference(differences: DifferenceFinancement[]) {
    const differencesParFinancement = differences.reduce((acc, difference) => {
      if (difference.donneesDifferentes) {
        const listeDifferences = acc.get(difference.idFinancement) || [];
        listeDifferences.push(difference.donneesDifferentes);
        acc.set(difference.idFinancement, listeDifferences);
      }
      return acc;
    }, new Map<number, NonNullable<DifferenceFinancement['donneesDifferentes']>[]>());

    this.sortie('<!DOCTYPE html>');
    this.sortie('<html>');
    this.sortie('<body>');
    this.sortie('<h1>Rapport des différences de financements</h1>');
    for (const [idFinancement, listeDifferences] of differencesParFinancement) {
      this.sortie(`<h2>Financement ID ${idFinancement}</h2>`);
      for (const difference of listeDifferences) {
        this.sortie('<h3>' + difference.nomDeLaDonnee + '</h3>');
        const resultat = diffWords(
          difference.valeurSurGrist ?? '',
          difference.nouvelleValeur ?? ''
        );
        const text = resultat
          .map((part) => {
            return part.added
              ? `<span style="color: green;">${escape(part.value)}</span>`
              : part.removed
              ? `<span style="color: red;">${escape(part.value)}</span>`
              : `<span style="color: gray;">${escape(part.value)}</span>`;
          })
          .join('');
        this.sortie('<code>');
        this.sortie(text);
        this.sortie('</code>');
      }
    }
    this.sortie('</body>');
    this.sortie('</html>');
  }
}

function escape(htmlStr: string): string {
  return htmlStr
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
