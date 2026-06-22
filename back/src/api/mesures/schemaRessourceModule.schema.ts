import z from 'zod';

export const schemaRessourceModule = z.strictObject({
  idModule: z.string().regex(/\d+/),
});
