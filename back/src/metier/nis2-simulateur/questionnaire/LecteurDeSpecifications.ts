import Papa from 'papaparse';
import { EnsembleDeSpecifications } from './EnsembleDeSpecifications.js';
import { FabriqueDeSpecifications } from './FabriqueDeSpecifications.js';
import { valideColonnesDuCSV, type SpecificationTexte } from './FormatDesSpecificationsCSV.js';

const { parse } = Papa;

export class LecteurDeSpecifications {
  private readonly fabrique = new FabriqueDeSpecifications();

  lis(contenuCsv: string): EnsembleDeSpecifications {
    const lignes = parse<SpecificationTexte>(contenuCsv, { header: true, skipEmptyLines: true, delimiter: ';' });

    valideColonnesDuCSV(lignes.meta.fields!);

    return new EnsembleDeSpecifications(lignes.data.map((ligne) => this.fabrique.transforme(ligne)));
  }
}
