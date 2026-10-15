import { type CodeSecteurContact } from './codesSecteurContact.js';

export const calculeCodeSecteurContact = (codeActivite: string): CodeSecteurContact | undefined => {
  if (codeActivite === '25.40Z' || codeActivite === '84.22Z') {
    return 'defense';
  }
  if (codeActivite.startsWith('86.') || codeActivite.startsWith('84.12')) {
    return 'sante';
  }

  if (codeActivite.startsWith('84.3')) {
    return 'social';
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
