import Papa from 'papaparse';

const { parse } = Papa;
import { FabriqueDeSpecifications } from './FabriqueDeSpecifications.js';
import { type SpecificationTexte, valideColonnesDuCSV } from './FormatDesSpecificationsCSV.js';
import { EnsembleDeSpecifications } from './EnsembleDeSpecifications.js';

export class LecteurDeSpecifications {
  private readonly fabrique = new FabriqueDeSpecifications();

  lis(contenuCsv: string): EnsembleDeSpecifications {
    const lignes = parse<SpecificationTexte>(contenuCsv, { header: true, skipEmptyLines: true, delimiter: ';' });

    valideColonnesDuCSV(lignes.meta.fields!);

    return new EnsembleDeSpecifications(lignes.data.map((ligne) => this.fabrique.transforme(ligne)));
  }
}
