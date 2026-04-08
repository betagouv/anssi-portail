import type {
  RegulationEntite,
  TypeEntite,
} from '../../../../../back/src/metier/nis2-simulateur/Regulation.definitions';

export const titres: Record<RegulationEntite, Record<TypeEntite, string>> = {
  Regule: {
    EntiteEssentielle: `Votre entité sera régulée par NIS 2<br/>en tant qu'entité essentielle (EE)`,
    EntiteImportante: `Votre entité sera régulée par NIS 2<br/>en tant qu'entité importante (EI)`,
    EnregistrementUniquement: `Votre entité sera régulée par NIS 2<br/>avec pour seule nécessité de s'enregistrer`,
    AutreEtatMembreUE: 'Votre entité sera régulée par NIS 2',
  },
  NonRegule: {
    EntiteEssentielle: 'Votre entité ne sera pas régulée par NIS 2',
    EntiteImportante: 'Votre entité ne sera pas régulée par NIS 2',
    EnregistrementUniquement: 'Votre entité ne sera pas régulée par NIS 2',
    AutreEtatMembreUE: 'Votre entité ne sera pas régulée par NIS 2',
  },
  Incertain: {
    EntiteEssentielle: "Votre entité relève de la compétence<br/>d'un autre État membre vis-à-vis de NIS 2",
    EntiteImportante: "Votre entité relève de la compétence<br/>d'un autre État membre vis-à-vis de NIS 2",
    EnregistrementUniquement: "Votre entité relève de la compétence<br/>d'un autre État membre vis-à-vis de NIS 2",
    AutreEtatMembreUE: "Votre entité relève de la compétence<br/>d'un autre État membre vis-à-vis de NIS 2",
  },
};

const indicatifEtChangeant = `Ce résultat se base sur les éléments saisis et est
<u>strictement indicatif</u> et <u>susceptible d'évoluer</u> dans le
cadre de l'adoption prochaine des textes législatifs et réglementaires
de transposition de la directive NIS 2.<br/> Ce simulateur ne se
substitue pas à une <u>analyse</u> approfondie (notamment d’ordre juridique)
<u>dont la responsabilité revient à l’entité elle-même</u>.`;

const indicatifSeulement = `Ce résultat se base sur les éléments saisis et est
<u>strictement indicatif</u>.<br/> Ce simulateur ne se substitue pas à
une <u>analyse</u> approfondie (notamment d’ordre juridique)
<u>dont la responsabilité revient à l’entité elle-même</u>.`;

export const sousTitre: Record<RegulationEntite, string> = {
  Regule: indicatifEtChangeant,
  NonRegule: indicatifEtChangeant,
  Incertain: indicatifSeulement,
};
