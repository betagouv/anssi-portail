import type { Profil } from '../stores/profil.store';
import { type CodeSecteurContact, codesSecteurContact } from './contacts.type';

export const estCodeSecteurContact = (
  codeSecteur: string
): codeSecteur is CodeSecteurContact => {
  return (codesSecteurContact as readonly string[]).includes(codeSecteur);
};

export const calculeCodeSecteurContact = (
  codeActivite: string
): CodeSecteurContact | undefined => {
  if (codeActivite === '25.40Z' || codeActivite === '84.22Z') {
    return 'defense';
  }
  if (
    codeActivite.startsWith('86.') ||
    codeActivite.startsWith('84.12') ||
    codeActivite.startsWith('84.3')
  ) {
    return 'sante';
  }

  if (
    codeActivite.startsWith('50.') ||
    codeActivite.startsWith('52.22') ||
    codeActivite === '52.24A' ||
    codeActivite.startsWith('42.91') ||
    codeActivite.startsWith('77.34')
  ) {
    return 'maritime';
  }

  if (codeActivite.startsWith('85.') || codeActivite.startsWith('72.1')) {
    return 'enseignement-recherche';
  }

  if (codeActivite.startsWith('51.')) {
    return 'aviation';
  }

  return undefined;
};

export const creeLienContactsUtiles = (profil: Profil | undefined) => {
  if (profil) {
    const codeSecteurContact = calculeCodeSecteurContact(profil.codeActivite);
    const parametres = new URLSearchParams();
    if (profil?.codeRegion) parametres.set('region', profil?.codeRegion);
    if (codeSecteurContact) parametres.set('secteur', codeSecteurContact);
    return `/contacts/#?${parametres.toString()}`;
  } else {
    return '/contacts';
  }
};
