import z from 'zod';
import { codeDepartement } from '../../metier/referentielDepartements';

export const schemaRessourceDemandesAide = z.strictObject({
  entiteAidee: z.strictObject({
    departement: z.enum(codeDepartement, 'Veuillez saisir un département valide.'),
    siret: z.string('Veuillez saisir un SIRET valide.').regex(/^\d{14}$/),
    raisonSociale: z.string().nonempty('Veuillez saisir une raison sociale valide.'),
    email: z.email('Veuillez saisir un email valide.').nonempty(),
  }),
  emailAidant: z.email('Veuillez saisir un email valide pour l’Aidant cyber.').optional(),
  identifiantAidant: z.uuid('Veuillez saisir un identifiant Aidant cyber valide.').optional(),
  siretAidant: z
    .string()
    .regex(/^\d{14}$/, 'Veuillez saisir un SIRET Aidant cyber valide.')
    .optional(),
  origine: z.string().trim().min(1, 'Veuillez saisir une origine valide.').optional(),
  validationCGU: z.boolean().refine((validationCGU) => !!validationCGU, 'Veuillez valider les CGU.'),
});

export type CorpsDemandeAide = z.infer<typeof schemaRessourceDemandesAide>;
