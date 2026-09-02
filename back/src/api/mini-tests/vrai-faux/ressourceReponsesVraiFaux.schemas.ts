import * as z from 'zod';

export const schemaPostRéponsesVraiFaux = z.strictObject({
  idQuestion: z.string(),
  réponseUtilisateur: z.boolean(),
  idCorrélation: z.string(),
});
