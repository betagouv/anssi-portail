import z from 'zod';

const schemaAdresseEmailOuVide = z
  .email("L'email est invalide")
  .optional()
  .or(z.string().length(0, "L'email est invalide").max(512, "L'email est invalide"));

export const schemaRessourceRetoursExperience = z.strictObject({
  raison: z.enum(['pas-clair', 'pas-le-temps', 'pas-decisionnaire', 'autre'], 'La raison est invalide'),
  emailDeContact: schemaAdresseEmailOuVide,
  precision: z.string().max(1024).optional(),
});
