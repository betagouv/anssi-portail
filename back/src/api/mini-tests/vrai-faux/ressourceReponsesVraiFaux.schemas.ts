import * as z from 'zod';

export const schemaPostRéponsesVraiFaux = z.strictObject({
  idQuestion: z.string().max(100),
  réponseUtilisateur: z.boolean(),
  idCorrélation: z.string().max(100),
});
