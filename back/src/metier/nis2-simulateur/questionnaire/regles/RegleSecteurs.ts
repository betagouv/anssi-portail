import { estValeurVide, type Regle } from '../Specifications';
import { ErreurLectureDeRegle } from './ErreurLectureDeRegle';
import type { EtatQuestionnaire } from '../../EtatQuestionnaire';
import type { SpecificationTexte } from '../FormatDesSpecificationsCSV';
import type { SecteurActivite } from '../../SecteurActivite.definitions';
import { contientUnParmi } from '../../commun.predicats';
import { libellesSecteursActivite } from '../../LibellesSecteursActivite';

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
