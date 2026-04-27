import z from 'zod';

export const schemaRessourceFavori = z.object({
  params: z.strictObject({
    id: z.string(),
  }),
});
