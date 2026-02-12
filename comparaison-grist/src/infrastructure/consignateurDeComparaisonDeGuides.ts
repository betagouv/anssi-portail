import { ComparaisonDeGuides, Guide } from '../metier/guides/guide.type';

export class ConsignateurDeComparaisonDeGuides {
  consigneComparaison(comparaison: ComparaisonDeGuides) {
    const contenuDuTableau = [
      ...comparaison.ajouts.map((ajout) => this.construisUneLigneAjout(ajout)),
      ...comparaison.suppressions.map((suppression) =>
        this.construisUneLigneSuppression(suppression)
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

  private construisUneCelluleAvecLeContenu(prefix: '+' | '-', contenu: string) {
    return `<td>

\`\`\`diff
${prefix} ${contenu}
\`\`\`
</td>`;
  }
}
