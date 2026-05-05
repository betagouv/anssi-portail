import z from 'zod';
import { codeDepartement } from '../metier/referentielDepartements';
import { codesRegion } from '../metier/referentielRegions';
import { codesSecteur } from '../metier/referentielSecteurs';
import { codesTranchesEffectif } from '../metier/referentielTranchesEffectifEtablissement';

const verifieLuhn = (numero: string) => {
  let somme = 0;
  let double = false;
  for (let i = numero.length - 1; i >= 0; i--) {
    let chiffre = parseInt(numero[i], 10);
    if (double) {
      chiffre *= 2;
      if (chiffre > 9) chiffre -= 9;
    }
    somme += chiffre;
    double = !double;
  }
  return somme % 10 === 0;
};

export const schemas = {
  organisation: {
    siret: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un SIRET valide.');
      return z.string(e).length(14, e).refine(verifieLuhn, e);
    },
    raisonSociale: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir une raison sociale valide.');
      return z.string(e).max(1024, e).nonempty(e);
    },
    secteur: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un secteur valide.');
      return z.enum(codesSecteur, e);
    },
    taille: (erreur: string | (() => string) | undefined = undefined) => {
      const e =
        typeof erreur === 'function' ? erreur() : (erreur ?? "Veuillez saisir une taille d'organisation valide.");
      return z.enum(codesTranchesEffectif, e);
    },
  },
  geographie: {
    departement: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un département valide.');
      return z.enum(codeDepartement, e);
    },
    region: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un code région valide.');
      return z.enum(codesRegion, e);
    },
  },
  internet: {
    adresseEmail: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un email valide.');
      return z.email(e).nonempty(e);
    },
  },
  communication: {
    numeroTelephone: (erreur: string | (() => string) | undefined = undefined) => {
      const e = typeof erreur === 'function' ? erreur() : (erreur ?? 'Veuillez saisir un numéro de téléphone valide.');
      return z.string(e).regex(/^0\d{9}$/, e);
    },
  },
} as const;
