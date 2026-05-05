import z from 'zod';
import { schemas } from '../schemas';

export const schemaRessourceDemandesAide = z.strictObject({
  entiteAidee: z.strictObject({
    departement: schemas.geographie.departement(),
    siret: schemas.organisation.siret(),
    raisonSociale: schemas.organisation.raisonSociale(),
    email: schemas.internet.adresseEmail(),
  }),
  emailAidant: schemas.internet.adresseEmail('Veuillez saisir un email valide pour l’Aidant cyber.').optional(),
  identifiantAidant: z.uuid('Veuillez saisir un identifiant Aidant cyber valide.').optional(),
  siretAidant: schemas.organisation.siret('Veuillez saisir un SIRET Aidant cyber valide.').optional(),
  origine: z
    .string()
    .trim()
    .min(1, 'Veuillez saisir une origine valide.')
    .max(128, "L'origine ne peut pas dépasser 128 caractères")
    .optional(),
  validationCGU: z.boolean().refine((validationCGU) => !!validationCGU, 'Veuillez valider les CGU.'),
});
