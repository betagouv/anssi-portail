import type {
  SousSecteurActivite,
  SousSecteurAutre,
} from '../../../../../back/src/metier/nis2-simulateur/SousSecteurActivite.definitions';
import type { SecteurActivite } from '../../../../../back/src/metier/nis2-simulateur/SecteurActivite.definitions';

export const estSousSecteurListe = (
  sousSecteur?: SousSecteurActivite | SecteurActivite
) => !sousSecteur?.startsWith('autre');

export const estSousSecteurAutre = (
  sousSecteur?: SousSecteurActivite
): sousSecteur is SousSecteurAutre => !!sousSecteur?.startsWith('autre');
