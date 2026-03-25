import type {
  SecteurActivite,
  SecteurComposite,
} from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';
import { ValeursSecteursComposites } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.valeurs';

export const estUnSecteurAvecDesSousSecteurs = (
  secteur: string
): secteur is SecteurComposite =>
  ValeursSecteursComposites.includes(secteur as SecteurComposite);

export const estSecteurAutre = (secteur: SecteurActivite) =>
  secteur.startsWith('autre');
