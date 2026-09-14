import { diffArrays } from 'diff';
import { ComparaisonDeFinancements, Financement } from '../../metier/financements/financement.type';

export class ConsignateurDeComparaisonDeFinancements {
  consigneComparaison(comparaison: ComparaisonDeFinancements) {
    const contenuDuTableau = [
      ...comparaison.ajouts.map((ajout) => this.construisUneLigneAjout(ajout)),
      ...comparaison.suppressions.map((suppression) => this.construisUneLigneSuppression(suppression)),
      ...comparaison.modifications.map((modification) => this.construisUneLigneModification(modification)),
    ].join('\n');
    return `<table>
<thead>
<tr>
<th>Identifiant</th>
<th>Nom</th>
<th>Bénéficiares</th>
<th>Condition</th>
<th>Contact</th>
<th>Entités élligibles</th>
<th>Financeur</th>
<th>Montant</th>
<th>Objectifs</th>
<th>Opérations élligibles</th>
<th>Périmètres géographiques</th>
<th>Régions</th>
<th>Sources</th>
<th>Types de financement</th>
</tr>
</thead>
<tbody>
${contenuDuTableau}</tbody>
</table>`;
  }

  private construisUneLigneAjout(financement: Financement) {
    return `<tr>
${this.construisUneCelluleAvecLeContenu(`+ ${financement.id}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.nom}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.benificiaires}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.condition}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.contact}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.entitesElligibles.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.financeur}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.montant}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.objectifs}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.operationsEligibles}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.perimetresGeographiques.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.regions.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.sources.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`+ ${financement.typesDeFinancement.join(', ')}`)}
</tr>
`;
  }

  private construisUneLigneSuppression(financement: Financement) {
    return `<tr>
${this.construisUneCelluleAvecLeContenu(`- ${financement.id}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.nom}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.benificiaires}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.condition}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.contact}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.entitesElligibles.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.financeur}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.montant}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.objectifs}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.operationsEligibles}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.perimetresGeographiques.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.regions.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.sources.join(', ')}`)}
${this.construisUneCelluleAvecLeContenu(`- ${financement.typesDeFinancement.join(', ')}`)}
</tr>
`;
  }

  private construisUneLigneModification({ cible, source }: { source: Financement; cible: Financement }) {
    return `<tr>
${this.construisUneCelluleDeDiff(source.id, cible.id)}
${this.construisUneCelluleDeDiff(source.nom, cible.nom)}
${this.construisUneCelluleDeDiff(source.benificiaires, cible.benificiaires)}
${this.construisUneCelluleDeDiff(source.condition, cible.condition)}
${this.construisUneCelluleDeDiff(source.contact, cible.contact)}
${this.construisUneCelluleDeDiffPourTableaux(source.entitesElligibles, cible.entitesElligibles)}
${this.construisUneCelluleDeDiff(source.financeur, cible.financeur)}
${this.construisUneCelluleDeDiff(source.montant, cible.montant)}
${this.construisUneCelluleDeDiff(source.objectifs, cible.objectifs)}
${this.construisUneCelluleDeDiff(source.operationsEligibles, cible.operationsEligibles)}
${this.construisUneCelluleDeDiffPourTableaux(source.perimetresGeographiques, cible.perimetresGeographiques)}
${this.construisUneCelluleDeDiffPourTableaux(source.regions, cible.regions)}
${this.construisUneCelluleDeDiffPourTableaux(source.sources, cible.sources)}
${this.construisUneCelluleDeDiffPourTableaux(source.typesDeFinancement, cible.typesDeFinancement)}
</tr>
`;
  }

  private construisUneCelluleDeDiff(contenuSource: string | number, contenuCible: string | number) {
    if (contenuCible === contenuSource) {
      return this.construisUneCelluleAvecLeContenu(contenuSource);
    }

    return this.construisUneCelluleAvecLeContenu(`- ${contenuCible}
+ ${contenuSource}`);
  }

  private construisUneCelluleDeDiffPourTableaux(source: string[], cible: string[]) {
    const contenu = diffArrays(cible, source, {
      oneChangePerToken: true,
    })
      .map((part) => {
        if (part.added) {
          return `+ ${part.value}`;
        }
        if (part.removed) {
          return `- ${part.value}`;
        }
        return part.value;
      })
      .join('\n');

    return this.construisUneCelluleAvecLeContenu(contenu);
  }

  private construisUneCelluleAvecLeContenu(contenu: string | number) {
    return `<td>

\`\`\`diff
${contenu}
\`\`\`
</td>`;
  }
}
