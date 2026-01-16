import { diffWords } from 'diff';
import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';
import { NouveauFinancement } from '../metier/nouveauFinancement';

export class GenerateurDeRapportsHtml implements GenerateurDeRapports {
  constructor(private readonly ecris: (ligne: string) => void) {}

  async genereRapports(
    differences: DifferenceFinancement[],
    nouveauxFinancements: NouveauFinancement[]
  ) {
    this.ecris('<!DOCTYPE html>');
    this.ecris('<html>');
    this.ecris('<body>');
    this.ecris('<h1>Rapport des financements</h1>');
    this.imprimeNouveauxFinancements(nouveauxFinancements);
    this.imprimeFinancementsModifies(differences);
    this.imprimeFinancementsSupprimes(differences);
    this.ecris('</body>');
    this.ecris('</html>');
  }

  private imprimeNouveauxFinancements(
    nouveauxFinancements: NouveauFinancement[]
  ) {
    this.ecris('<h2>Nouveaux financements</h2>');
    if (nouveauxFinancements.length > 0) {
      this.ecris('<ul><li>');
      this.ecris(
        nouveauxFinancements
          .map(
            (financement) =>
              `<a href=${financement.url} target="blank_">${financement.nom}</a>`
          )
          .join('</li><li>')
      );
      this.ecris('</li></ul>');
    } else {
      this.ecris('<p>Pas de nouveau financement trouvé</p>');
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

    this.ecris('<h2>Financements modifiés</h2>');

    if (differencesParFinancement.size === 0) {
      this.ecris('<p>Aucun financement modifié</p>');
      return;
    }
    for (const [idFinancement, listeDifferences] of differencesParFinancement) {
      this.ecris(`<h3>Financement ID ${idFinancement}</h3>`);
      for (const difference of listeDifferences) {
        this.ecris('<h4>' + difference.nomDeLaDonnee + '</h4>');
        const resultat = diffWords(
          difference.valeurSurGrist ?? '',
          difference.nouvelleValeur ?? ''
        );
        const text = resultat
          .map((part) => {
            if (part.added) {
              return `<span style="color: green;">${escape(part.value)}</span>`;
            }
            if (part.removed) {
              return `<span style="color: red;">${escape(part.value)}</span>`;
            }
            return `<span style="color: gray;">${escape(part.value)}</span>`;
          })
          .join('');
        this.ecris('<code>');
        this.ecris(text);
        this.ecris('</code>');
      }
      this.ecris('<hr>');
    }
  }

  private imprimeFinancementsSupprimes(differences: DifferenceFinancement[]) {
    const finacementsSupprimes = differences.filter(
      (diff) => diff.etat === 'supprimé'
    );
    this.ecris('<h2>Financements supprimés</h2>');
    if (finacementsSupprimes.length > 0) {
      this.ecris('<ul><li>');
      this.ecris(
        finacementsSupprimes.map((diff) => diff.idFinancement).join('</li><li>')
      );
      this.ecris('</li></ul>');
    } else {
      this.ecris('<p>Aucun financement à supprimer</p>');
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
