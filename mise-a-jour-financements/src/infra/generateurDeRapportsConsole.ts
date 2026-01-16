import { diffWords } from 'diff';
import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';
import pc from 'picocolors';
import { NouveauFinancement } from '../metier/nouveauFinancement';

export class GenerateurDeRapportsConsole implements GenerateurDeRapports {
  async genereRapports(
    differences: DifferenceFinancement[],
    nouveauxFinancements: NouveauFinancement[]
  ) {
    const differencesParFinancement = differences.reduce((acc, difference) => {
      if (difference.donneesDifferentes) {
        const listeDifferences = acc.get(difference.idFinancement) || [];
        listeDifferences.push(difference.donneesDifferentes);
        acc.set(difference.idFinancement, listeDifferences);
      }
      return acc;
    }, new Map<number, NonNullable<DifferenceFinancement['donneesDifferentes']>[]>());

    console.info('# Rapport des différences de financements :');
    for (const [idFinancement, listeDifferences] of differencesParFinancement) {
      console.info('----------------------------------------');
      console.info(`## Financement ID ${idFinancement} :`);
      for (const difference of listeDifferences) {
        console.info('### ' + difference.nomDeLaDonnee + ' :');
        const resultat = diffWords(
          difference.valeurSurGrist,
          difference.nouvelleValeur
        );
        const text = resultat
          .map((part) => {
            return part.added
              ? pc.green(part.value)
              : part.removed
              ? pc.red(part.value)
              : pc.gray(part.value);
          })
          .join('');
        console.info(text);
      }
    }
    console.info('----------------------------------------');
    console.info('nouveauxFinancements : ', nouveauxFinancements);
  }
}
