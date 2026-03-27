import * as z from 'zod';
import {
  ValeursappartenancePaysUnionEuropeenne,
  ValeursDesignationOperateurServicesEssentiels,
  ValeursPetitMoyenGrand,
  ValeursTypeEntitePublique,
  ValeursTypeStructure,
} from '../../metier/nis2-simulateur/ChampsSimulateur.valeurs';
import { ValeursSecteursActivites } from '../../metier/nis2-simulateur/SecteurActivite.valeurs';
import { TousLesSousSecteurs } from '../../metier/nis2-simulateur/SousSecteurActivite.valeurs';
import { ToutesLesActivites } from '../../metier/nis2-simulateur/Activite.operations';

export const schemaPostSimulateurNis2 = () =>
  z.strictObject({
    etapeCourante: z.literal('resultat'),
    designationOperateurServicesEssentiels: z.array(z.enum(ValeursDesignationOperateurServicesEssentiels)),
    appartenancePaysUnionEuropeenne: z.array(z.enum(ValeursappartenancePaysUnionEuropeenne)),
    typeStructure: z.array(z.enum(ValeursTypeStructure)),
    trancheNombreEmployes: z.array(z.enum(ValeursPetitMoyenGrand)),
    trancheChiffreAffaire: z.array(z.enum(ValeursPetitMoyenGrand)),
    trancheBilanFinancier: z.array(z.enum(ValeursPetitMoyenGrand)),
    secteurActivite: z.array(z.enum(ValeursSecteursActivites)),
    sousSecteurActivite: z.array(z.enum(TousLesSousSecteurs)),
    activites: z.array(z.enum(ToutesLesActivites)),
    typeEntitePublique: z.array(z.enum(ValeursTypeEntitePublique)),
    localisationFournitureServicesNumeriques: z.array(z.enum(ValeursappartenancePaysUnionEuropeenne)),
    paysDecisionsCyber: z.array(z.enum(ValeursappartenancePaysUnionEuropeenne)),
    paysOperationsCyber: z.array(z.enum(ValeursappartenancePaysUnionEuropeenne)),
    paysPlusGrandNombreSalaries: z.array(z.enum(ValeursappartenancePaysUnionEuropeenne)),
  });
