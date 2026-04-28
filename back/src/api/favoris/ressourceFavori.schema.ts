import z from 'zod';

export const schemaParametersRessourceFavori = z.strictObject({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
});
