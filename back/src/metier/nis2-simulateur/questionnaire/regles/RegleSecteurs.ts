import { estValeurVide, type Regle } from '../Specifications.js';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle.js';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire.js';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV.js';
import type { SecteurActivite } from '../../SecteurActivite.definitions.js';
import { contientUnParmi } from '../../commun.predicats.js';
import { libellesSecteursActivite } from '../../LibellesSecteursActivite.js';

export class RegleSecteurs implements Regle {
  constructor(private readonly secteurActivite: SecteurActivite) {}

  evalue(reponses: EtatQuestionnaire): boolean {
    const secteurs = reponses.secteurActivite;
    return contientUnParmi(this.secteurActivite)(secteurs);
  }

  static nouvelle(texte: SpecificationTexte): RegleSecteurs | undefined {
    const secteurAttendu = texte['Secteurs'];

    if (estValeurVide(secteurAttendu)) return;

    const secteur = Object.entries(libellesSecteursActivite).find(([, valeur]) => valeur == secteurAttendu);

    if (!secteur) throw new ErreurLectureDeRegle(secteurAttendu, 'Secteurs');

    const [id] = secteur;
    return new RegleSecteurs(id as SecteurActivite);
  }
}
