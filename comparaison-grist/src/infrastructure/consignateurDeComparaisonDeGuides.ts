import { ComparaisonDeGuides, Guide } from '../metier/guides/guide.type';

export class ConsignateurDeComparaisonDeGuides {
  consigneComparaison(comparaison: ComparaisonDeGuides) {
    const contenuDuTableau = [
      ...comparaison.ajouts.map((ajout) => this.construisUneLigneAjout(ajout)),
      ...comparaison.suppressions.map((suppression) =>
        this.construisUneLigneSuppression(suppression)
      ),
      ...comparaison.modifications.map((modification) =>
        this.construisUneLigneModification(modification)
      ),
    ].join('\n');
    return `<table>
<thead>
<tr>
<th>Identifiant</th>
<th>Titre</th>
<th>Thématique</th>
<th>Date de publication</th>
<th>Date de mise à jour</th>
<th>Description</th>
<th>Image</th>
<th>Documents</th>
<th>Langue</th>
<th>Collections</th>
<th>Besoins</th>
</tr>
</thead>
<tbody>
${contenuDuTableau}</tbody>
</table>`;
  }

  private construisUneLigneAjout(guide: Guide) {
    return `<tr>
${this.construisUneCelluleAvecLeContenu('+', guide.id)}
${this.construisUneCelluleAvecLeContenu('+', guide.nom)}
${this.construisUneCelluleAvecLeContenu('+', guide.thematique)}
${this.construisUneCelluleAvecLeContenu('+', guide.datePublication)}
${this.construisUneCelluleAvecLeContenu('+', guide.dateMiseAJour)}
${this.construisUneCelluleAvecLeContenu('+', guide.description)}
${this.construisUneCelluleAvecLeContenu('+', guide.nomImage ?? '')}
${this.construisUneCelluleAvecLeContenu('+', guide.documents.map((document) => `${document.libelle} : ${document.nomFichier}`).join('\n'))}
${this.construisUneCelluleAvecLeContenu('+', guide.langue)}
${this.construisUneCelluleAvecLeContenu('+', guide.collections.join(', '))}
${this.construisUneCelluleAvecLeContenu('+', guide.besoins.join(', '))}
</tr>
`;
  }

  private construisUneLigneSuppression(guide: Guide) {
    return `<tr>
${this.construisUneCelluleAvecLeContenu('-', guide.id)}
${this.construisUneCelluleAvecLeContenu('-', guide.nom)}
${this.construisUneCelluleAvecLeContenu('-', guide.thematique)}
${this.construisUneCelluleAvecLeContenu('-', guide.datePublication)}
${this.construisUneCelluleAvecLeContenu('-', guide.dateMiseAJour)}
${this.construisUneCelluleAvecLeContenu('-', guide.description)}
${this.construisUneCelluleAvecLeContenu('-', guide.nomImage ?? '')}
${this.construisUneCelluleAvecLeContenu('-', guide.documents.map((document) => `${document.libelle} : ${document.nomFichier}`).join('\n'))}
${this.construisUneCelluleAvecLeContenu('-', guide.langue)}
${this.construisUneCelluleAvecLeContenu('-', guide.collections.join(', '))}
${this.construisUneCelluleAvecLeContenu('-', guide.besoins.join(', '))}
</tr>
`;
  }

  private construisUneLigneModification({
    cible,
    source,
  }: {
    source: Guide;
    cible: Guide;
  }) {
    return `<tr>
${this.construisUneCelluleDeDiff(source.id, cible.id)}
${this.construisUneCelluleDeDiff(source.nom, cible.nom)}
${this.construisUneCelluleDeDiff(source.thematique, cible.thematique)}
${this.construisUneCelluleDeDiff(source.datePublication, cible.datePublication)}
${this.construisUneCelluleDeDiff(source.dateMiseAJour, cible.dateMiseAJour)}
${this.construisUneCelluleDeDiff(source.description, cible.description)}
${this.construisUneCelluleDeDiff(source.nomImage ?? '', cible.nomImage ?? '')}
${this.construisUneCelluleDeDiff(source.documents.map((document) => `${document.libelle} : ${document.nomFichier}`).join('\n'), cible.documents.map((document) => `${document.libelle} : ${document.nomFichier}`).join('\n'))}
${this.construisUneCelluleDeDiff(source.langue, cible.langue)}
${this.construisUneCelluleDeDiff(source.collections.join(', '), cible.collections.join(', '))}
${this.construisUneCelluleDeDiff(source.besoins.join(', '), cible.besoins.join(', '))}
</tr>
`;
  }

  private construisUneCelluleDeDiff(
    contenuSource: string,
    contenuCible: string
  ) {
    if (contenuCible === contenuSource) {
      return `<td>

\`\`\`diff
${contenuSource}
\`\`\`
</td>`;
    }

    return `<td>

\`\`\`diff
- ${contenuSource}
+ ${contenuCible}
\`\`\`
</td>`;
  }

  private construisUneCelluleAvecLeContenu(prefix: '+' | '-', contenu: string) {
    return `<td>

\`\`\`diff
${prefix} ${contenu}
\`\`\`
</td>`;
  }
}
