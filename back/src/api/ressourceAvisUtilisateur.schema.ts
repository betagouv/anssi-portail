import z from 'zod';

export const schemaRessourceAvisUtilisateur = z.strictObject({
  niveauDeSatisfaction: z
    .int()
    .min(1, 'Le niveau de satisfaction est invalide')
  commentaire: z
    .string()
    .min(1, 'Le commentaire est requis')
    .max(8 * 1024),
  emailDeContact: z.email("L'email est invalide").optional(),
});
