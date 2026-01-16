import { diffWords } from 'diff';
import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';
import { NouveauFinancement } from '../metier/nouveauFinancement';

export class GenerateurDeRapportsHtml implements GenerateurDeRapports {
  constructor(private readonly sortie: (ligne: string) => void) {}

  async genereRapports(
    differences: DifferenceFinancement[],
    nouveauxFinancements: NouveauFinancement[]
  ) {
    this.sortie('<!DOCTYPE html>');
    this.sortie('<html>');
    this.sortie('<body>');
    this.sortie('<h1>Rapport des financements</h1>');
    this.imprimeNouveauxFinancements(nouveauxFinancements);
    this.imprimeFinancementsModifies(differences);
    this.imprimeFinancementsSupprimes(differences);
    this.sortie('</body>');
    this.sortie('</html>');
  }

  private imprimeNouveauxFinancements(
    nouveauxFinancements: NouveauFinancement[]
  ) {
    this.sortie('<h2>Nouveaux financements</h2>');
    if (nouveauxFinancements.length > 0) {
      this.sortie('<ul><li>');
      this.sortie(
        nouveauxFinancements
          .map(
            (financement) =>
              `<a href=${financement.url} target="blank_">${financement.nom}</a>`
          )
          .join('</li><li>')
      );
      this.sortie('</li></ul>');
    } else {
      this.sortie('<p>Pas de nouveau financement trouvé</p>');
    }
  }

  private imprimeFinancementsModifies(differences: DifferenceFinancement[]) {
    const differencesParFinancement = differences.reduce((acc, difference) => {
      if (difference.donneesDifferentes) {
        const listeDifferences = acc.get(difference.idFinancement) || [];
        listeDifferences.push(difference.donneesDifferentes);
        acc.set(difference.idFinancement, listeDifferences);
      }
      return acc;
    }, new Map<number, NonNullable<DifferenceFinancement['donneesDifferentes']>[]>());

    this.sortie('<h2>Financements modifiés</h2>');

    if (differencesParFinancement.size === 0) {
      this.sortie('<p>Aucun financement modifié</p>');
      return;
    }
    for (const [idFinancement, listeDifferences] of differencesParFinancement) {
      this.sortie(`<h3>Financement ID ${idFinancement}</h3>`);
      for (const difference of listeDifferences) {
        this.sortie('<h4>' + difference.nomDeLaDonnee + '</h4>');
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
      this.sortie('<hr>');
    }
  }

  private imprimeFinancementsSupprimes(differences: DifferenceFinancement[]) {
    const finacementsSupprimes = differences.filter(
      (diff) => diff.etat === 'supprimé'
    );
    this.sortie('<h2>Financements supprimés</h2>');
    if (finacementsSupprimes.length > 0) {
      this.sortie('<ul><li>');
      this.sortie(
        finacementsSupprimes.map((diff) => diff.idFinancement).join('</li><li>')
      );
      this.sortie('</li></ul>');
    } else {
      this.sortie('<p>Aucun financement à supprimer</p>');
    }
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
