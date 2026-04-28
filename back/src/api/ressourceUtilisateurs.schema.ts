import z from 'zod';

export const schemaRessourceUtilisateurs = z.strictObject({
  token: z.string().nonempty('Le token est invalide'),
  telephone: z
    .string()
    .regex(/^0\d{9}$/, 'Le téléphone est invalide')
    .optional(),
  domainesSpecialite: z.array(z.string().max(256)).min(1, { message: 'Les domaines de spécialité sont invalides' }),
  siretEntite: z.string().regex(/^\d{14}$/, { message: 'Le siret est invalide' }),
  cguAcceptees: z.boolean("L'acceptation des CGU est invalide"),
  infolettreAcceptee: z.boolean("L'acceptation de l'infolettre est invalide"),
});
