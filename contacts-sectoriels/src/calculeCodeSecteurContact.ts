import { type CodeSecteurContact } from './codesSecteurContact.js';

const codeSecteurContactParCodeNAF = new Map<string, CodeSecteurContact>([
  ['25.40Z', 'defense'],
  ['84.22Z', 'defense'],

  ['84.12', 'sante'],
  ['86', 'sante'],

  ['84.3', 'social'],

  ['42.91', 'maritime'],
  ['50', 'maritime'],
  ['52.22', 'maritime'],
  ['52.24A', 'maritime'],
  ['77.34', 'maritime'],

  ['72.1', 'enseignement-recherche'],
  ['85', 'enseignement-recherche'],

  ['51', 'aviation'],
]);

export const calculeCodeSecteurContact = (codeActivité: string): CodeSecteurContact | undefined => {
  const NAF_REGEX = /^(\d{2})\.(\d)(\d)([A-Z])$/;
  const match = codeActivité.match(NAF_REGEX);

  if (!match) return undefined;

  const [, division, groupe, classe, sousClasse] = match;

  return (
    codeSecteurContactParCodeNAF.get(`${division}.${groupe}${classe}${sousClasse}`) ??
    codeSecteurContactParCodeNAF.get(`${division}.${groupe}${classe}`) ??
    codeSecteurContactParCodeNAF.get(`${division}.${groupe}`) ??
    codeSecteurContactParCodeNAF.get(`${division}`)
  );
};
