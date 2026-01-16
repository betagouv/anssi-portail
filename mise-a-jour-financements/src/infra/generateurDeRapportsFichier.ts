import { DifferenceFinancement } from '../metier/differenceFinancement';
import { GenerateurDeRapports } from '../metier/generateurDeRapports';
import { NouveauFinancement } from '../metier/nouveauFinancement';
import { GenerateurDeRapportsHtml } from './generateurDeRapportsHtml';
import fs from 'node:fs/promises';

export class GenerateurDeRapportsFichier implements GenerateurDeRapports {
  private readonly repertoire = 'rapports';

  async genereRapports(
    differences: DifferenceFinancement[],
    nouveauxFinancements: NouveauFinancement[]
  ) {
    let chaineHtml = '';
    const generateurInterne = new GenerateurDeRapportsHtml((ligne: string) => {
      chaineHtml += ligne + '\n';
    });
    await generateurInterne.genereRapports(differences, nouveauxFinancements);
    await fs.access(this.repertoire).catch(async () => {
      await fs.mkdir(this.repertoire);
    });
    await fs.writeFile(
      `${process.cwd()}/${this.repertoire}/financements-en-differences.html`,
      chaineHtml
    );
  }
}
