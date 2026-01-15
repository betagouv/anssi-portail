import { diffWords } from 'diff';
import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';
import pc from 'picocolors';

export const generateurDeRapportsConsole: GenerateurDeRapports = {
  async genereRapportDifference(
    differences: DifferenceFinancement[],
    sortie: (str: string) => void = (s) => console.info(s)
  ) {
    const differencesParFinancement = differences.reduce((acc, difference) => {
      if (difference.donneesDifferentes) {
        const listeDifferences = acc.get(difference.idFinancement) || [];
        listeDifferences.push(difference.donneesDifferentes);
        acc.set(difference.idFinancement, listeDifferences);
      }
      return acc;
    }, new Map<number, NonNullable<DifferenceFinancement['donneesDifferentes']>[]>());

    sortie('# Rapport des différences de financements :');
    for (const [idFinancement, listeDifferences] of differencesParFinancement) {
      sortie('----------------------------------------');
      sortie(`## Financement ID ${idFinancement} :`);
      for (const difference of listeDifferences) {
        sortie('### ' + difference.nomDeLaDonnee + ' :');
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
        sortie(text);
      }
    }
    sortie('----------------------------------------');
  },
};
