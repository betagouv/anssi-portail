import z from 'zod';

export const schemaPostRéponsesRéflexesCyber = z.strictObject({
  idCorrélation: z.string().max(100),
  idScénario: z.enum(['entreprise', 'collectivité']),
  idRôle: z.enum(['direction', 'si', 'communication', 'juridique', 'rh', 'relations']),
  numéroÉvènement: z.number().int().min(1).max(6),
  réflexe: z.enum(['bon', 'mauvais', 'aucun']),
});
