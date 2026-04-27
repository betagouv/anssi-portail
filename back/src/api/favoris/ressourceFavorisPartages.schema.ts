import z from 'zod';

export const schemaRessourceFavorisPartages = z.object({
  params: z.strictObject({
    id: z.uuid("L'id est invalide"),
  }),
});
