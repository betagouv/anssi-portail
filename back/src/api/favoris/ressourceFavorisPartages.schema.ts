import z from 'zod';

export const schemaRessourceFavorisPartages = z.strictObject({
  id: z.uuid("L'id est invalide"),
});
