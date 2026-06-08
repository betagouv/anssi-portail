import z from 'zod';

export const schemaRessourceAvisMesure = z.strictObject({
  retour: z.enum(['POSITIF', 'NEGATIF'], 'Le retour doit être "POSITIF" ou "NEGATIF"'),
  commentaire: z.string().optional(),
});
